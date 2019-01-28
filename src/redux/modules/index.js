import { combineReducers } from 'redux';

import settings from './settings';
import blynk from './blynk';

export default combineReducers({
    settings,
    blynk,
});
