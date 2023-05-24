/*jshint esversion: 6 */
import { USER, VIEW } from "../constants";
import userMgrAPI from "../api/userMgrAPI";
import { isSystemUser } from "../common/authorization";
import util from "../common/util";

let userMgrCreators = {
    delUser(userId) {
        return (dispatch) => {
            dispatch({type: USER.DEL_USER_REQUEST});
            userMgrAPI.delUser(userId).then(
                (response) => {
                    dispatch({
                        type: USER.DEL_USER_SUCCESS,
                        userId,
                        response
                    });
                },
                (error) => dispatch({
                    type: USER.DEL_USER_FAILURE,
                    error
                })
            );
        };
    },
    getSelfInfo() {
        return (dispatch) => {
            dispatch({type: USER.GET_OWN_INFO});
            userMgrAPI.getSelfInfo().then(
                (response) => {
                    dispatch({
                        type: USER.GET_OWN_INFO_SUCCESS,
                        response
                    });
                    if (response.data && response.data.data && isSystemUser(response.data.data)) {
                        dispatch({
                            type: VIEW.SET_ADMIN_VIEW,
                        });
                    } else {
                        dispatch({
                            //type: VIEW.SET_SS_VIEW,
                            type: VIEW.STAY_WITH_PREVIOUS_VIEW,
                        });
                    }
                },
                (error) => dispatch({
                    type: USER.GET_OWN_INFO_FAILURE,
                    error
                })
            );
        };
    },
    toggleAdminView() {
        return (dispatch) => {
            dispatch({type: VIEW.TOGGLE});
        };
    },
    //switch to self service view
    switchToSSView() {
        return (dispatch) => {
            dispatch({type: VIEW.SET_SS_VIEW});
        };
    },
    importAdLdapUsers() {
        return (dispatch) => {
            dispatch({type: USER.IMPORT_AD_LDAP_REQUEST});
            userMgrAPI.importAdLdap().then(
                (response) => {
                    const data = response.data && response.data.data;
                    dispatch({
                        type: USER.IMPORT_AD_LDAP_SUCCESS,
                        errData: data
                    });
                },
                (err) => {
                    const errorData = err.response && err.response.data;
                    const { data } = errorData;
                    if (errorData.error !== "1010930") {//大类错误提示
                        util.showErrorMessage(err);
                    }
                    dispatch({
                        type: USER.IMPORT_AD_LDAP_FAILURE,
                        errData: data
                    });
                }
            );
        };
    },
    delPreImportedUsers(skipCallApi) {
        return (dispatch) => {
            if (skipCallApi) {
                dispatch({
                    type: USER.DEL_PRE_IMPORT_USERS_SUCCESS
                });
            } else {
                dispatch({type: USER.DEL_PRE_IMPORT_USERS_REQUEST});
                userMgrAPI.delPreImportedUsers().then(
                    () => {
                        dispatch({
                            type: USER.DEL_PRE_IMPORT_USERS_SUCCESS
                        });
                    },
                    (error) => {
                        util.showErrorMessage(error);
                        dispatch({
                            type: USER.DEL_PRE_IMPORT_USERS_FAILURE
                        });
                    }
                );   
            }
        };
    }
};

export default userMgrCreators;