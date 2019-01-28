import * as Immutable from 'immutable';
import { UPDATE_SETTINGS } from './actionTypes';

export function updateSettings(settings) {
    settings = Immutable.fromJS(settings);

    return {
        type: UPDATE_SETTINGS,
        settings,
    };
}
