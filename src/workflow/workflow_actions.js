import alt from '../../../alt.js'
import Services from 'services'

class WorkflowActions {
  constructor() {
    this.generateActions(
      'begin',
      'finish',
      'restart',
      'cancel',

      'forward',
      'backward',
      'jumpTo',
      'halt',

      'snapshot',
      'restore'
    )
  }
}

let Axns = alt.createActions(WorkflowActions)

Services.registerActions('WorkflowActions', Axns)

export default Axns;
