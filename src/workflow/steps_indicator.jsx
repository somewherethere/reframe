import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import SemanticClasses from 'utils/semantic_classes'
import WorkflowActions from './workflow_actions'

export default class StepsIndicator extends React.Component {
  static defaultProps = {
    steps: [],
    vertical: false,
    segment: true,
    fluid: true,
    link: true
  }

  render() {
    var stepClass = ['workflow-steps', 'ui', 'steps']
    var stepCount = _(this.props.steps).reject({hidden: true}).size()
    if(this.props.vertical) {
      stepClass.push('vertical')
    }
    else {
      stepClass.push(
        SemanticClasses.numberToClass(stepCount)
      )
    }
    if(this.props.segment) {
      stepClass.push('segment')
    }
    if(this.props.fluid) {
      stepClass.push('fluid')
    }

    return (
      <div className={stepClass.join(' ')}>
        {_(this.props.steps).reject({hidden: true}).map(step => {
          let stepClass = 'step'
          if(!this.getStepEnabled(step)) {
            stepClass = 'disabled step'
          }
          if(step.active) {
            stepClass = 'active step'
          }

          // Render linked steps
          if(this.props.link) {
            let link = this.props.link
            return (
              <a className={stepClass} onClick={_.bind(this.linkTo, this, step.stepId)}>
                {step.icon ? <i className={`${step.icon} icon`}/> : null}
                <div className="content">
                  <div className="title">{step.label}</div>
                  <div className="description">{step.description}</div>
                </div>
              </a>
            )
          }
          // Render steps without links
          else {
            return (
              <div className={stepClass}>
                {step.icon ? <i className={`${step.icon} icon`}/> : null}
                <div className="content">
                  <div className="title">{step.label}</div>
                  <div className="description">{step.description}</div>
                </div>
              </div>
            )
          }
        }).value()}
      </div>
    )
  }

  getStepEnabled(step) {
    if(this.props.progress) {
      const progressLevel = _.find(this.props.progress, {id: step.id})
      return _.get(progressLevel, 'complete', false) || _.get(progressLevel, 'visited', false)
    }
    else {
      return true
    }
  }

  linkTo(stepId) {
    WorkflowActions.jumpTo(this.props.workflowId, stepId)
  }
}
