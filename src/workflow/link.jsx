import React from 'react'
import ReactDOM from 'react-dom'
import WorkflowActions from './workflow_actions'

export default class StepLink extends React.Component {
  static contextTypes = {
    workflowId: React.PropTypes.string
  }

  render() {
    return (
      <a className={this.props.className} onClick={this.navigate.bind(this)}>{this.props.children}</a>
    )
  }

  navigate() {
    WorkflowActions.jumpTo(
      this.context.workflowId || this.props.workflowId,
      this.props.to)
  }
}
