
import {Signal} from 'raid'
import {adaptor} from 'raid-addons'

const initial = {

}

export const {{signalName}} = new Signal(initial)
export const connect = adaptor({{signalName}})
export const dispatch = type => payload => {{signalName}}.emit({type, payload})
export const emit = (type, payload) => {{signalName}}.emit({type, payload})
