/*jshint esversion: 6 */
import update from "immutability-helper";
import { USER } from "../constants";
import util from "../common/util";
import userUtil from "../components/user/userUtil";

const user = (state = {
    isLoading: false
}, action) => {
    let curIndex;
    switch (action.type) {
    case USER.DEL_USER_SUCCESS:
        util.showSuccessMessage();
        curIndex = state.users.findIndex(user => user.userId === action.userId);
        return update(state, {users: {$splice: [[curIndex, 1]]}});
    case USER.DEL_USER_FAILURE:
        util.showErrorMessage(action.error);
        return state;
    case USER.GET_OWN_INFO_SUCCESS:
        return Object.assign({}, state, {
            selfInfo: action.response.data && action.response.data.data,// self user info detail
            isSystemUser: action.response.data && userUtil.isSystemUser(action.response.data.data),
        });
    case USER.GET_OWN_INFO_FAILURE:
        return state;
    case USER.IMPORT_AD_LDAP_REQUEST:
        return Object.assign({}, state, {
            isLoading: true
        });
    case USER.IMPORT_AD_LDAP_SUCCESS:
    case USER.IMPORT_AD_LDAP_FAILURE:
        return Object.assign({}, state, {
            errData: action.errData,
            isLoading: false
        });
    case USER.DEL_PRE_IMPORT_USERS_SUCCESS:
        return Object.assign({}, state, {
            errData: null
        });
    default:
        return state;
    }
};

export default user;
