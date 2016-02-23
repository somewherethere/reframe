import React from 'react'
import ReactDOM from 'react-dom'

export default class WorkflowResumeModal extends React.Component {

  static propTypes = {
    resumeTitle: React.PropTypes.string.isRequired,
    resumeMessage: React.PropTypes.string.isRequired,
    resumeIcon: React.PropTypes.string.isRequired,
    onResume: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    resumeTitle: 'Resume Workflow',
    resumeMessage: 'You left this workflow unfinished. Would you like to pick up where you left off?',
    resumeIcon: 'history'
  }

  render() {
    return (
      <div className="ui basic workflow resume modal">
        <i className="close icon"/>
        <div className="header">
          {this.props.resumeTitle}
        </div>
        <div className="image content">
          <div className="image">
            <i className={`${this.props.resumeIcon} icon`}/>
          </div>
          <div className="description">
            <p>{this.props.resumeMessage}</p>
          </div>
        </div>
        <div className="actions">
          <div className="two fluid ui inverted buttons">
            <div className="ui red basic inverted deny button">
              <i className="remove icon"/>
              No
            </div>
            <div className="ui green basic inverted approve button">
              <i className="checkmark icon"/>
              Yes
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    $('.ui.basic.resume.workflow.modal')
      .modal({
        onApprove: this.doResume.bind(this),
        onDeny:    this.hide.bind(this)
      })
    ;
  }

  show() {
    $('.ui.basic.resume.workflow.modal')
      .modal('show')
    ;
  }

  hide() {
    $('.ui.basic.resume.workflow.modal')
      .modal('hide')
    ;
  }

  toggle() {
    $('.ui.basic.resume.workflow.modal')
      .modal('toggle')
    ;
  }

  doResume() {
    this.hide()
    this.props.onResume()
  }

}
