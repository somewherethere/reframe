import React from 'react'
import ReactDOM from 'react-dom'
import WorkflowActions from './workflow_actions'

export default class StepButtons extends React.Component {
  static propTypes = {
    showNext: React.PropTypes.bool,
    showPrev: React.PropTypes.bool,
    nextEnabled: React.PropTypes.bool,
    prevEnabled: React.PropTypes.bool,
    workflowId: React.PropTypes.string.isRequired,
    nextButtonOptions: React.PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      color: React.PropTypes.string,
      icon: React.PropTypes.string
    }),
    prevButtonOptions: React.PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      color: React.PropTypes.string,
      icon: React.PropTypes.string
    })
  }

  static defaultProps = {
    showNext: false,
    showPrev: false,
    nextEnabled: true,
    prevEnabled: true,
    nextCompletes: false,
    nextButtonOptions: {
      label: 'Next',
      color: 'default',
      icon: 'right arrow'
    },
    prevButtonOptions: {
      label: 'Previous',
      color: 'default',
      icon: 'left arrow'
    }
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="workflow-buttons ui clearing basic segment">
        {this.backButton()}
        {this.fwdButton()}
      </div>
    )
  }

  backButton() {
    const options = _.merge(
      {},
      StepButtons.defaultProps.prevButtonOptions,
      this.props.prevButtonOptions
    )
    if (this.props.showPrev) {
      if(this.props.prevEnabled) {
        return (
          <button onClick={this.doPrev.bind(this)} className={`ui ${options.color} labeled icon primary button`}>
            {options.label}
            <i className={`${options.icon} icon`}/>
          </button>
        )
      }
      else {
        return (
          <button onClick={() => {}} className={`ui ${options.color} disabled labeled icon primary button`}>
            {options.label}
            <i className={`${options.icon} icon`}/>
          </button>
        )
      }
    }
    else {
      return null
    }
  }

  fwdButton() {
    const options = _.merge(
      {},
      StepButtons.defaultProps.nextButtonOptions,
      this.props.nextButtonOptions
    )

    if (this.props.showNext) {
      if(this.props.nextEnabled) {
        return (
          <button onClick={this.doNext.bind(this)} className={`ui ${options.color} right floated right labeled icon primary button`}>
            {options.label}
            <i className={`${options.icon} icon`}/>
          </button>
        )
      }
      else {
        return (
          <button onClick={() => {}} className={`ui ${options.color} disabled right floated right labeled icon primary button`}>
            {options.label}
            <i className={`${options.icon} icon`}/>
          </button>
        )
      }
    }
    else {
      return null
    }
  }

  doNext() {
    if(this.props.nextCompletes) {
      WorkflowActions.finish(this.props.workflowId)
    }
    else {
      WorkflowActions.forward(this.props.workflowId)
    }
  }

  doPrev() {
    WorkflowActions.backward(this.props.workflowId)
  }

  doJumpTo(step) {
    WorkflowActions.jumpTo(this.props.workflowId, step)
  }

}
