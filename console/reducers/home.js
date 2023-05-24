/*jshint esversion: 6 */
import { HOME } from "../constants";

const home = (state = {
    searchParams: {}
}, action) => {
    switch (action.type) {
    case HOME.SET_CUR_MENUITEM:
        return Object.assign({}, state, {
            curMenuKey: action.curMenuKey
        });
    case HOME.SET_SEARCH_PARAMS:
        return Object.assign({}, state, {
            searchParams: action.searchParams
        });
    case HOME.CLEAR_SEARCH_PARAMS:
        return Object.assign({}, state, {
            searchParams: {}
        });
    default:
        return state;
    }
};

export default home;
