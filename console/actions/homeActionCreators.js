/*jshint esversion: 6 */
import mainStore from "../store/mainStore";
import { HOME } from "../constants";

let homeActionCreators = {
    setCurMenuItem(key) {
        return mainStore.dispatch({
            type: HOME.SET_CUR_MENUITEM,
            curMenuKey: key
        });
    },
    setSearchParams(searchParams) {
        return (dispatch) => {
            dispatch({
                type: HOME.SET_SEARCH_PARAMS,
                searchParams
            });
        };
    },
    clearSearchParams() {
        return (dispatch) => {
            dispatch({
                type: HOME.CLEAR_SEARCH_PARAMS
            });
        };
    }
};

export default homeActionCreators;