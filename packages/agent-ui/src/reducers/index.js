import { combineReducers } from 'redux';

import agents from './agents';
import appendSegment from './appendSegment';
import createMap from './createMap';
import maps from './maps';
import mapExplorer from './mapExplorer';
import segment from './segment';
import segments from './segments';
import selectRefs from './selectRefs';

const rootReducer = combineReducers({
  agents,
  maps,
  mapExplorer,
  segment,
  segments,
  createMap,
  appendSegment,
  selectRefs
});

export default rootReducer;
