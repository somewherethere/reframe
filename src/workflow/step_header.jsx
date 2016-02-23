import React from 'react'
import ReactDOM from 'react-dom'

export default class StepHeader extends React.Component {
  render() {
    const content = {__html: this.props.instructions || ''}
    return (
      <div className="workflow-header ui warning message attached top">
        <div className="header">[STEP {this.props.currentStep} / {this.props.totalSteps}] {this.props.title}</div>
        <div className="instructions" dangerouslySetInnerHTML={content} />
      </div>
    )
  }
}
