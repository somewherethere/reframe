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

import _ from 'lodash'
import {uid} from 'random'

const initialState = {
  stepIndex:           0,
  transitionDirection: 1,
  status:              'INITIALIZED',
  progress:            {}
}

const workflowReducer = (state = _.clone(initialState), action) => {
  const actionMappings = {
    BEGIN:    handleBegin,
    FINISH:   handleFinish,
    RESTART:  handleRestart,
    CANCEL:   handleCancel,
    FORWARD:  handleForward,
    BACKWARD: handleBackward,
    JUMP_TO:  handleJumpTo,
    HALT:     handleHalt,
    SNAPSHOT: handleSnapshot,
    RESTORE:  handleRestore
  }

  return _.get(actionMappings, action.type, handleDefault)(state, action)
}

const handleBegin    = (state, action) => {
  return { status: 'IN_PROGRES', ...state }
}
const handleFinish   = (state, action) => {
  return { status: 'FINISHED', ...state }
}
const handleRestart  = (state, action) => {
  return { stepIndex: 0, ...state }
}
const handleCancel   = (state, action) => {
  return { status: 'CANCELLED', ...state }
}
const handleForward  = (state, action) => {
  return {
    stepIndex: state.stepIndex + 1,
    transitionDirection: 1,
    ...state
  }
}
const handleBackward = (state, action) => {
  return {
    stepIndex: state.stepIndex - 1,
    transitionDirection: -1,
    ...state
  }
}
const handleJumpTo   = (state, action) => {
  const direction = action.stepIndex > state.stepIndex ? 1 : -1
  return {
    stepIndex: action.stepIndex,
    transitionDirection: direction,
    ...state
  }
}
const handleHalt     = (state, action) => {
  return { status: 'HALTED', ...state }
}
const handleSnapshot = (state, action) => {
  return state
}
const handleRestore  = (state, action) => {
  return state
}
const handleDefault  = (state, action) => {
  return state
}
