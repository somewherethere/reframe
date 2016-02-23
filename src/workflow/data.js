import _ from 'lodash'
import {uid} from 'utils/random'

export default class WorkflowData {
  /**
   * Constructs a new WorkflowData instance to be used as a state store for a
   * workflow.
   * @param  {String}   workflowId  Unique ID of the workflow using this store
   * @param  {element}  workflowRef A reference to the Workflow component
   * @return {WorkflowData}         store instance
   */
  constructor(workflowId, workflowRef) {
    this.workflow = {
      ref: workflowRef,
      id: workflowId
    }
    this.data = {}
    this.listeners = {}
  }

  /**
   * Replaces the entire state of the store with the provided object. No-op if
   * provided value is empty.
   * @param  {Object} data The state to load
   */
  load(data) {
    if(!_.isEmpty(data)) {
      this.data = data
    }
  }

  /**
   * Returns the full state of the store
   * @return {Object} the data of the store
   */
  save() {
    return this.data
  }

  /**
   * Delete data from the store
   * @return {undefined}
   */
  drop() {
    this.data = {}
  }

  /**
   * Sets the data that corresponds to a specific step of the workflow; behaves
   * similarly to React's setState in that it merges new values with old ones.
   * @param {String} stepId The unique ID of the step
   * @param {Object} data   The data to store for this step
   */
  setStepData(stepId, data) {
    _.set(this.data, stepId, _.merge(_.get(this.data, stepId, {}), data))
    this.callListeners(stepId)
  }

  /**
   * Overwrites the data that corresponds to a specific step. No merging behavior.
   * @param  {String} stepId The unique ID of the step
   * @param  {Object} data   The data to store for this step
   */
  replaceStepData(stepId, data) {
    _.set(this.data, stepId, data)
    this.callListeners(stepId)
  }

  /**
   * Gets the data associated with a given step
   * @param  {String} stepId The ID of the step to fetch data for
   * @return {Object}        The data stored for this step
   */
  getStepData(stepId) {
    return _.get(this.data, stepId, null)
  }

  /**
   * Gets a summary view of all the data stored by this instance, optionally
   * filtered by a step ID
   * @param  {[String]} step_id A step to fetch data for
   * @return {Object}         The summary data
   */
  getSummary(step_id) {
    if(step_id) {
      return _.get(this.data, step_id, null)
    }
    else {
      return this.data
    }
  }

  /**
   * Add a listener that is called when the store updates. Listeners receive the
   * state of their assigned step when called. Returns a function that can be
   * called to remove the listener.
   * @param {String}   stepId   The step ID to attach this listener for
   * @param {Function} callback The listener function
   * @return {Function}         The de-registration function
   */
  addListener(stepId, callback) {
    let id = uid()
    let path = `${stepId}.${id}`
    _.set(this.listeners, path, callback)
    return () => {
      this.listeners[stepId] = _.omit(this.listeners[stepId], id)
    }
  }

  /**
   * Calls all registered listeners for a given step_id
   * @param  {String} stepId the StepID to call listeners for
   */
  callListeners(stepId) {
    _.chain(this.listeners)
      .get(stepId, {})
      .values()
      .each(listener => listener(this.data))
      .run()
  }
}
