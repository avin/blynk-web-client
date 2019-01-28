import * as Immutable from 'immutable';
import { UPDATE_SETTINGS } from './actionTypes';

const initialState = Immutable.fromJS({});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case UPDATE_SETTINGS: {
            const { settings } = action;

            return state.merge(settings);
        }
        default:
            return state;
    }
}
