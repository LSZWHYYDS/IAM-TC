/*jshint esversion: 6 */
import axios from "axios";
import util from "../common/util";
import mainStore from "../store/mainStore";
import { LOGIN, PWD, PERM_SETS } from "../constants";
import authAPI from "../api/authAPI";
import userMgrAPI from "../api/userMgrAPI";
import { hasAdminPerm, isSuperAdmin } from "../common/authorization";

let authActionCreators = {
    loginSuccess(accessToken, tcode) {
        return (dispatch) => {
            axios.defaults.headers.common.Authorization = "Bearer " + accessToken;
            axios.defaults.headers.common.tcode = tcode;
            sessionStorage.setItem("reduxPersist:login", JSON.stringify({
                loggedIn: true
            }));

            if (hasAdminPerm()) {
                //for SUPER_ADMIN, who can do everything, in this case we will not load its permsets from server
                if (isSuperAdmin()) {
                    dispatch({
                        type: LOGIN.LOGIN_SUCCESS,
                        data: { userPermSets: [PERM_SETS.SUPER_ADMIN] }
                    });
                } else { //non SUPER_ADMIN, load its permission sets
                    userMgrAPI.getSelfPermSets().then(
                        (response) => {
                            dispatch({
                                type: LOGIN.LOGIN_SUCCESS,
                                data: { userPermSets: response.data.data }
                            });
                        },
                        () => {
                            dispatch({
                                type: LOGIN.LOGIN_SUCCESS,
                                data: { userPermSets: PERM_SETS.EMPTY}
                            });
                        }
                    );
                }
            } else { //for self-service user
                dispatch({
                    type: LOGIN.LOGIN_SUCCESS,
                    data: { userPermSets: PERM_SETS.SELF_SERVICE}
                });
            }
        };
    },
    logout(notifServer) {
        if (!notifServer) {
            util.clearLoginStorage();
            return mainStore.dispatch({
                type: LOGIN.LOGOUT_NOT_NOTIFY_SERVER
            });
        }
        return (dispatch) => {
            dispatch({type: LOGIN.LOGOUT_REQUEST});
            util.clearLoginStorage();
            util.CookieUtil.unset("IAMSSO", "/");
            window.location.href = '/iam/logout/tc'
        };
    },
    updatePwdAfterForget(params) {
        return (dispatch) => {
            dispatch({type: PWD.UPDATE_PWD_AFTER_FORGET});
            authAPI.updatePwdAfterForget(params).then(
                (response) => {
                    util.showSuccessMessage();
                    dispatch({
                        type: PWD.UPDATE_PWD_AFTER_FORGET_SUCCESS,
                        response
                    });
                },
                (error) => {
                    util.showErrorMessage(error);
                    dispatch({
                        type: PWD.UPDATE_PWD_AFTER_FORGET_FAILURE,
                        error
                    });
                }
            );
        };
    },
    resetUpdatePwdStatus() {
        return (dispatch) => {
            dispatch({
                type: PWD.RESET_UPDATE_PWD_STATUS
            });
        };
    }
};

export default authActionCreators;
