/**
 * Created by shaliantao on 2017/8/30.
 */
/*jshint esversion: 6 */
import { APP } from "../constants";
import update from "immutability-helper";

const app = (state = {
    appDetail: {},
    appList: []
}, action) => {
    switch (action.type) {
    case APP.SET_APP_DETAIL:
        return update(state, {appDetail:{$set: action.data}});
    case APP.MERGE_APP_DETAIL:
        return update(state, {appDetail:{$merge: action.data}});
    case APP.SET_APP_LIST:
        return update(state, {appList:{$set: action.data.data.items}});
    case APP.SET_EXTRA_AUFH_FACTOR_ATTR_LIST:
        return update(state, {extraAuthFactorAttrList:{$set: action.data.data.items}});
    case APP.SET_PROFILE_LIST:
        return update(state, {profileList: {$set: action.data.data.items}});
    default:
        return state;
    }
};

export default app;