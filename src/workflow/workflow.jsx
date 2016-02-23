import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import WorkflowActions from './workflow_actions'
import ActionBag from 'utils/action_bag'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import WorkflowData from './data'
import history from 'utils/history'

import StepsIndicator from './steps_indicator.jsx'
import StepContainer from './step.jsx'
import WorkflowResumeModal from './resume_modal.jsx'

import localForage from 'localforage'

const uid = () => Math.floor(Math.random() * 999999999).toString(36)

export default class Workflow extends React.Component {

  static propTypes = {
    startStep:         React.PropTypes.element,
    endStep:           React.PropTypes.element,
    steps:             React.PropTypes.arrayOf(React.PropTypes.element),
    id:                React.PropTypes.string,
    trackProgress:     React.PropTypes.bool,
    unstyled:          React.PropTypes.bool,
    autoSave:          React.PropTypes.bool,
    autoRestore:       React.PropTypes.bool,
    confirmNavigation: React.PropTypes.bool,
    promptForResume:   React.PropTypes.bool,
    autoResume:        React.PropTypes.bool,
    debug:             React.PropTypes.bool
  }

  static defaultProps = {
    startStep:         null,
    endStep:           null,
    trackProgress:     true,
    unstyled:          false,
    autoSave:          true,
    autoRestore:       true,
    confirmNavigation: true,
    promptForResume:   false,
    autoResume:        false,
    debug:             false
  }

  static childContextTypes = {
    workflowId: React.PropTypes.string
  }

  getChildContext() {
    return {
      workflowId: this.id
    }
  }

  constructor(props) {
    super(props)

    this.id      = props.id || uid()
    this.actions = new ActionBag(WorkflowActions)

    this.actions.addCondition((id) => id === this.id)
    this.actions.setRearg(([_id, ...rest]) => rest)

    this.actions.addListener('BEGIN', this.onWorkflowBegin.bind(this))
    this.actions.addListener('FINISH', this.onWorkflowFinish.bind(this))
    this.actions.addListener('RESTART', this.onWorkflowRestart.bind(this))
    this.actions.addListener('CANCEL', this.onWorkflowCancel.bind(this))
    this.actions.addListener('FORWARD', this.onWorkflowForward.bind(this))
    this.actions.addListener('BACKWARD', this.onWorkflowBackward.bind(this))
    this.actions.addListener('JUMP_TO', this.onWorkflowJumpTo.bind(this))
    this.actions.addListener('HALT', this.onWorkflowHalt.bind(this))
    this.actions.addListener('SNAPSHOT', this.onWorkflowSnapshot.bind(this))
    this.actions.addListener('RESTORE', this.onWorkflowRestore.bind(this))

    this.animations = {
      forward:  {
        enter:       'slideInRight',
        enterActive: 'animating-in',
        leave:       'slideOutLeft',
        leaveActive: 'animating-out'
      },
      backward: {
        enter:       'slideInLeft',
        enterActive: 'animating-in',
        leave:       'slideOutRight',
        leaveActive: 'animating-out'
      }
    }

    let stepState = _.map(props.steps, step => {
      return { ...step, active: false, stepId: step.id || uid() }
    })

    if (props.startStep) {
      stepState.unshift({ ...props.startStep, active: true, stepId: step.id || uid(), hidden: true })
    }

    if (props.endStep) {
      stepState.unshift({ ...props.endStep, active: false, stepId: step.id || uid(), hidden: true })
    }

    this.state = {
      stepIndex:           0,
      transitionDirection: 1,
      numSteps:            props.steps.length,
      status:              'INITIALIZED',
      steps:               stepState,
      progress:            this.initializeProgress(stepState, props.trackProgress)
    }

    this.data = new WorkflowData(this.id, this)

    this.queuedTransition = 'NONE'
  }

  initializeProgress(stepState, track = true) {
    if (track) {
      return _.map(stepState,
        step => { return { id: step.stepId, complete: false, visited: false } })
    }
    else {
      return _.map(stepState,
        step => { return { id: step.stepId, complete: true, visited: false } })
    }
  }

  render() {
    // TODO: this is a dumb way to fix the numbering issue, but w/e
    const hasStartStep = _.first(this.state.steps).hidden
    const stepDef      = this.state.steps[this.state.stepIndex];
    const si           = this.state.stepIndex
    const stepNumber   = hasStartStep ? si : si + 1
    return (
      <div className="workflow">
        <StepsIndicator steps={this.getStepsForIndicator()} workflowId={this.id} progress={this.state.progress}
                        segment={false}/>
        <div className="workflow-body">
          <StepContainer ref="stepContainer"
                         key={this.state.stepIndex}
                         index={this.state.stepIndex}
                         skippable={false}
                         workflowId={this.id}
                         workflowRef={this}
                         workflowData={this.data}
                         currentStep={stepNumber}
                         totalSteps={this.stepCount}
                         canGoBack={this.state.stepIndex > 0}
                         canGoForward={this.state.stepIndex < this.props.steps.length - 1}
            {...stepDef} />
        </div>
        <WorkflowResumeModal ref="resumeModal" onResume={this.resume.bind(this)}/>
        {this.renderDebugger()}
      </div>
    )
  }

  dehydrate() {
    localForage.setItem(`workflow_data_${this.id}`, this.data.save())
    localForage.setItem(`workflow_progress_${this.id}`, this.state.progress)
  }

  rehydrate() {
    localForage.getItem(`workflow_data_${this.id}`)
      .then(data => this.data.load(data))

    localForage.getItem(`workflow_progress_${this.id}`)
      .then(data => {
        if (!_.isEmpty(data)) {
          this.setState({ progress: data })
          if (this.props.promptForResume && _.any(data, { visited: true })) {
            this.refs.resumeModal.show()
          }
          else if (this.props.autoResume) {
            this.resume()
          }
        }
      })
  }

  resume() {
    const latestStep = _.findLast(this.state.progress, { visited: true })
    if (latestStep) {
      this.doJumpTo(latestStep.id)
    }
  }

  clearStorage(cb = _.noop) {
    localForage.removeItem(`workflow_data_${this.id}`, () => {
      localForage.removeItem(`workflow_progress_${this.id}`, cb)
    })
  }

  componentWillMount() {
    if (this.props.autoSave) {
      this.dehydrateFn = this.dehydrate.bind(this)
      window.addEventListener('beforeunload', this.dehydrateFn)
    }
    if (this.props.autoRestore) {
      this.rehydrate()
    }
    if (this.props.confirmNavigation) {
      window.addEventListener('beforeunload', this.confirmOnPageExit)
    }
  }

  componentWillUnmount() {
    if (this.props.autoSave) {
      window.removeEventListener('beforeunload', this.dehydrateFn)
    }
    if (this.props.confirmNavigation) {
      window.removeEventListener('beforeunload', this.confirmOnPageExit)
    }
    this.actions.removeListeners()
  }

  componentDidMount() {
  }

  getStepsForIndicator() {
    return _(this.state.steps)
      .map((step, index) => {
        return {
          ...step,
          active: index === this.state.stepIndex
        }
      })
      .value()
  }

  get stepCount() {
    return _(this.state.steps).reject({ hidden: true }).size()
  }

  get stepRefs() {}

  get currentStep() {
    return _.get(this.props, `steps[${this.state.stepIndex}].component`, null)
  }

  get nextStep() {
    return _.get(this.props, `steps[${this.state.stepIndex + 1}].component`, null)
  }

  get prevStep() {
    return _.get(this.props, `steps[${this.state.stepIndex - 1}].component`, null)
  }


  // Queued Transitions

  runQueuedTransition() {
    if (this.queuedTransition !== 'NONE') {
      const queueActions = {
        'JUMP':   step => this.doJumpTo(step),
        'NEXT':   () => this.doForward(),
        'PREV':   () => this.doBackward(),
        'FINISH': () => this.doFinish()
      }

      let [action, ...args] = this.queuedTransition

      _.get(queueActions, action, _.noop)(...args)

      this.clearQueuedTransition()
    }
  }

  setQueuedTransition(type, ...args) {
    this.queuedTransition = [type, ...args]
  }

  clearQueuedTransition() {
    this.queuedTransition = 'NONE'
  }


  // Callback triggers

  onWorkflowBegin() {
    this.setState({ status: 'IN_PROGRESS' })
  }

  onWorkflowFinish() {
    let canFinish = this.callStepHook('workflowWillComplete', this.refs.stepContainer.getViewComponent())
    if (canFinish === false) {
      this.setQueuedTransition('FINISH')
      return
    }
    doFinish()
  }

  doFinish() {
    this.setState({ status: 'FINISHED' })
    this.clearStorage((function () {
      if (this.props.redirect) {
        history.pushState(null, this.props.redirect)
      }
    }).bind(this))
  }

  onWorkflowRestart(reason) {
    this.setState({ status: 'IN_PROGRESS' })
  }

  onWorkflowCancel(reason) {
    this.setState({ status: 'CANCELLED' })
  }

  onWorkflowForward(fromStage, toStage) {
    let canTransition = this.callStepHook('workflowWillTransition', this.refs.stepContainer.getViewComponent())
    if (canTransition === false) {
      console.log('Step cancelled workflow transition.')
      this.setQueuedTransition('NEXT')
      return
    }
    this.doForward()
  }

  doForward() {
    this.markProgress(this.state.steps[this.state.stepIndex].stepId, true, true)
    this.markProgress(this.state.steps[this.state.stepIndex + 1].stepId, false, true)
    this.setState({ stepIndex: this.state.stepIndex + 1, transitionDirection: 1 })
  }

  onWorkflowBackward(fromStage, toStage) {
    let canTransition = this.callStepHook('workflowWillTransition', this.refs.stepContainer.getViewComponent())
    if (canTransition === false) {
      console.log('Step cancelled workflow transition.')
      this.setQueuedTransition('PREV')
      return
    }
    this.doBackward()
  }

  doBackward() {
    this.markProgress(this.state.steps[this.state.stepIndex].stepId)
    this.setState({ stepIndex: this.state.stepIndex - 1, transitionDirection: -1 })
  }

  onWorkflowJumpTo(step) {
    let canTransition = this.callStepHook('workflowWillTransition', this.refs.stepContainer.getViewComponent())
    if (canTransition === false) {
      console.log('Step cancelled workflow transition.')
      this.setQueuedTransition('JUMP', step)
      return
    }
    this.doJumpTo(step)
  }

  doJumpTo(step) {
    // Transition to a specific index if the step is a number
    if (_.isNumber(step)) {
      this.markProgress(this.state.steps[this.state.stepIndex].stepId)
      this.setState({
        stepIndex:           step,
        transitionDirection: this.state.stepIndex < step ? -1 : 1
      })
    }
    // Transition to a step with a given ID
    else if (_.isString(step)) {
      let idx = _.findIndex(this.state.steps, { stepId: step })
      // FIXME: Emit a warning if the step isn't found (idx == -1)
      this.markProgress(this.state.steps[this.state.stepIndex].stepId)
      this.setState({
        stepIndex:           idx,
        transitionDirection: this.state.stepIndex < idx ? -1 : 1
      })
    }
  }

  onWorkflowHalt(reason) {}

  onWorkflowSnapshot() {}

  onWorkflowRestore(data) {}

  confirmOnPageExit(e) {
    // If we haven't been passed the event get the window.event
    e = e || window.event;

    var message = 'You have unsaved changes. Are you sure you want to leave this page?';

    // For IE6-8 and Firefox prior to version 4
    if (e) {
      e.returnValue = message;
    }

    // For Chrome, Safari, IE8+ and Opera 12+
    return message;
  };

  // Calls hooks on
  callStepHook(hook, ref, ...args) {
    return _.get(ref, hook, _.noop).bind(ref)(...args)
  }

  chooseAnimationSet() {
    if (this.state.transitionDirection > 0) {
      return _.get(this.animations, 'forward')
    }
    else {
      return _.get(this.animations, 'backward')
    }
  }

  // Manage Progress
  markProgress(step, completed = true, visited = true) {
    let tsp   = this.state.progress
    let match = { id: step }
    let id    = _.findIndex(tsp, match)
    if (id >= 0) {
      this.setState({ progress: _.set(tsp, `${id}.complete`, completed) })
      this.setState({ progress: _.set(tsp, `${id}.visited`, visited) })
    }
  }

  reset() {
    this.doJumpTo(0)
    this.setState({ progress: this.initializeProgress(this.state.steps, this.props.trackProgress) })
  }


  // Debugging
  renderDebugger() {
    if (process.env.NODE_ENV !== 'development' || this.props.debug === false) {
      return null
    }

    const clear    = () => {
      this.clearStorage();
      this.data.drop()
    }
    const show     = () => { console.log(this.data.save()) }
    const reset    = () => { this.reset() }
    const progress = () => { console.log(this.state.progress) }

    return (
      <div className="workflow-debugger">
        <div className="ui bottom attached buttons">
          <button className="ui icon button"><i className="bug icon"/></button>
          <button className="ui button" onClick={show}>Show Storage Contents</button>
          <button className="ui button" onClick={clear}>Clear Storage</button>
          <button className="ui button" onClick={progress}>Show Progress Data</button>
          <button className="ui button" onClick={reset}>Reset Progress</button>
        </div>
      </div>
    )
  }
}
