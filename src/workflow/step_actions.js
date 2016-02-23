import alt from '../../../alt.js'
import Services from 'services'

class StepActions {
  constructor() {
    this.generateActions(
      'next',
      'previous'
    )
  }
}

let Axns = alt.createActions(StepActions)

Services.registerActions('StepActions', Axns)

export default Axns;
