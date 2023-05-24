/**
 * Created by shaliantao on 2017/8/30.
 */
/*jshint esversion: 6 */
import { APP } from "../constants";

let appActionCreators = {
    setAppDetail(data) {
        return (dispatch) => {
            dispatch({
                type: APP.SET_APP_DETAIL,
                data
            });
        };
    },
    setAppList(data) {
        return (dispatch) => {
            dispatch({
                type: APP.SET_APP_LIST,
                data
            });
        };
    },
    mergeAppDetail(data) {
        return (dispatch) => {
            dispatch({
                type: APP.MERGE_APP_DETAIL,
                data
            });
        };
    },
    setExtraAuthFactorAttrList(data) {
        return (dispatch) => {
            dispatch({
                type: APP.SET_EXTRA_AUFH_FACTOR_ATTR_LIST,
                data
            });
        };
    },

    setProfileList(data) {
        return (dispatch) => {
            dispatch({
                type: APP.SET_PROFILE_LIST,
                data
            });
        };
    }
};

export default appActionCreators;
