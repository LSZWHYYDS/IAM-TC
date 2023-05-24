/*jshint esversion: 6 */
import { LOGIN, PWD } from "../constants";
import { whoami, hasAdminPerm, isSuperAdmin } from "../common/authorization";

const login = (state = {}, action) => {
    switch (action.type) {
    case LOGIN.LOGIN_SUCCESS:
        return Object.assign({}, state, {
            loggedIn: true,
            hasAdminPerm: hasAdminPerm(), // is current authenticated user has any admin permission?
            isSuperAdmin: isSuperAdmin(),// is SUPER_ADMIN ?
            whoami: whoami(),
            userPermSets: action.data.userPermSets,// current user's permission sets.
        });
    case LOGIN.LOGOUT_NOT_NOTIFY_SERVER:
    case LOGIN.LOGOUT_SUCCESS:
    case LOGIN.LOGOUT_FAILURE:
        return Object.assign({}, state, {
            loggedIn: false
        });
    case PWD.UPDATE_PWD_AFTER_FORGET_SUCCESS:
        return Object.assign({}, state, {
            updatePwdSuccess: true
        });
    case PWD.UPDATE_PWD_AFTER_FORGET_FAILURE:
    case PWD.RESET_UPDATE_PWD_STATUS:
        return Object.assign({}, state, {
            updatePwdSuccess: false
        });
    default:
        return state;
    }
};

export default login;