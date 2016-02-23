import React from 'react'
import ReactDOM from 'react-dom'
import WorkflowActions from './workflow_actions'

export default class StepContainer extends React.Component {

  static propTypes = {
    title       : React.PropTypes.string.isRequired,
    index       : React.PropTypes.number.isRequired,
    skippable   : React.PropTypes.bool,
    workflowId  : React.PropTypes.string.isRequired,
    workflowRef : React.PropTypes.element.isRequired,
    stepId      : React.PropTypes.string.isRequired,
    component   : React.PropTypes.element.isRequired,
    canGoForward: React.PropTypes.bool.isRequired,
    canGoBack   : React.PropTypes.bool.isRequired,
    onNext      : React.PropTypes.func,
    onPrev      : React.PropTypes.func
  }

  static defaultProps = {
    skippable: false
  }

  constructor(props) {
    super(props)
  }

  render() {
    const hooks = {
      next: this.doNext.bind(this),
      prev: this.doPrev.bind(this),
      jumpTo: this.doJumpTo.bind(this),
      continue: () => this.props.workflowRef.runQueuedTransition()
    }
    const data = {
      get: () => this.props.workflowData.getStepData(this.props.stepId),
      set: (values) => this.props.workflowData.setStepData(this.props.stepId, values),
      replace: (values) => this.props.workflowData.replaceStepData(this.props.stepId, values),
      summary: (step) => this.props.workflowData.getSummary(step),
      listen: (callback) => this.props.workflowData.addListener(this.props.stepId, callback)
    }
    return (
      <div className={`step-${this.props.currentStep}`}>
        {React.cloneElement(this.props.component, {ref: 'view_component', data, hooks, ...this.props})}
      </div>
    )
  }

  doNext() {
    WorkflowActions.forward(this.props.workflowId)
  }

  doPrev() {
    WorkflowActions.backward(this.props.workflowId)
  }

  doJumpTo(step) {
    WorkflowActions.jumpTo(this.props.workflowId, step)
  }

  componentDidMount() {
    _.result(this.refs.view_component, 'stepWillEnter')
  }

  componentWillUnmount() {
    _.result(this.refs.view_component, 'stepWillLeave')
  }

  workflowWillTransition() {
    return _.result(this.refs.view_component, 'workflowWillTransition')
  }

  componentDidUpdate(prevState) {}

  componentWillReceiveProps(prevProps, nextProps) {}

  getViewComponent() {
    return this.refs.view_component
  }

}
