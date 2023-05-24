/*jshint esversion: 6 */
export const LOGIN = {
    NOT_LOGIN : "Not logged in",
    LOGIN_SUCCESS : "User logged in",
    LOGOUT_REQUEST : "To logout",
    LOGOUT_SUCCESS : "User logged out",
    LOGOUT_FAILURE : "Logout failed",
    LOGOUT_NOT_NOTIFY_SERVER: "Logout without notifying server",
};
export const HOME = {
    SET_CUR_MENUITEM: "Set current menu item",
    SET_ADMIN_TYPE: "Set admin type",
    SET_LOADING: "Set loading status",
    SET_SEARCH_PARAMS: "Set search params",
    CLEAR_SEARCH_PARAMS: "Clear search params"
};
export const USER = {
    GET_USERS_REQUEST: "To get user list",
    GET_USERS_SUCCESS: "Got user list",
    GET_USERS_FAILURE: "Failed to get user list",
    DEL_USER_REQUEST: "Del user request",
    DEL_USER_SUCCESS: "Del user success",
    DEL_USER_FAILURE: "Del user failed",
    GET_OWN_INFO: "To get own info",
    GET_OWN_INFO_SUCCESS: "Get own info success",
    GET_OWN_INFO_FAILURE: "Failed to get own info",
    IMPORT_AD_LDAP_REQUEST: "To import AD LDAP",
    IMPORT_AD_LDAP_SUCCESS: "Import AD LDAP success",
    IMPORT_AD_LDAP_FAILURE: "Import AD LDAP failed",
    DEL_PRE_IMPORT_USERS_REQUEST: "to delete pre import users",
    DEL_PRE_IMPORT_USERS_SUCCESS: "Delete pre import users success",
    DEL_PRE_IMPORT_USERS_FAILURE: "Delete pre import users failed"
};
export const TEMPLATE = {
    GET_TEMPLATES_REQUEST: "To get templates",
    GET_TEMPLATES_SUCCESS: "Got templates success",
    GET_TEMPLATES_FAILURE: "Failed to get templates",
    SET_TEMPLATE_REQUEST: "To set template",
    SET_TEMPLATE_SUCCESS: "Set template success",
    SET_TEMPLATE_FAILURE: "Failed to set template"
};
export const APP = {
    MERGE_APP_DETAIL: "Merge app detail",
    SET_APP_DETAIL: "Set app detail",
    SET_APP_LIST: "Set app list",
    SET_EXTRA_AUFH_FACTOR_ATTR_LIST: "Set extra auth factor attr list",
    SET_PROFILE_LIST: "Set profile list",
};
export const ERROR = {
    FORCE_TO_CHANGE_PWD : "1010212",
    INVALID_USERNAME_OR_PWD : "1010200"
};
export const PWD = {
    UPDATE_PWD_AFTER_FORGET: "To update password after forget",
    UPDATE_PWD_AFTER_FORGET_SUCCESS: "To update password success after forget",
    UPDATE_PWD_AFTER_FORGET_FAILURE: "Failed to update password after forget",
    RESET_UPDATE_PWD_STATUS: "Reset update password status"
};
export const VIEW = {
    TOGGLE: "Toggle console view.",
    SET_ADMIN_VIEW: "Switch console to admin view.",
    SET_SS_VIEW: "Switch console to self service view.",
    STAY_WITH_PREVIOUS_VIEW: "when a new access token is issued, stay with previous view",
};

export const PERM_SETS = {
    //placeholders
    SUPER_ADMIN: "*",
    SELF_SERVICE: [],
    EMPTY: [],

    //accounting.user
    VIEW_USER: "VIEW_USER",
    DELETE_USER: "DELETE_USER",
    EDIT_USER: "EDIT_USER",
    EDIT_USER_PWD: "EDIT_USER_PWD",
    EXPORT_USER: "EXPORT_USER",
    IMPORT_USER: "IMPORT_USER",
    NEW_USER: "NEW_USER",

    //accounting.tag
    VIEW_TAG: "VIEW_TAG",
    DELETE_TAG: "DELETE_TAG",
    EDIT_TAG: "EDIT_TAG",
    NEW_TAG: "NEW_TAG",

    //accounting.extattr
    VIEW_EXT_ATTR: "VIEW_EXT_ATTR",
    EDIT_EXT_ATTR: "EDIT_EXT_ATTR",
    NEW_EXT_ATTR: "NEW_EXT_ATTR",

    //accounting.datasource, aka linker
    // VIEW_DATASOURCE: "VIEW_DATASOURCE",
    // DELETE_DATASOURCE: "DELETE_DATASOURCE",
    // EDIT_DATASOURCE: "EDIT_DATASOURCE",
    // NEW_DATASOURCE: "NEW_DATASOURCE",

    //accounting.profile
    // VIEW_PROFILE: "VIEW_PROFILE",
    // DELETE_PROFILE: "DELETE_PROFILE",
    // EDIT_PROFILE: "EDIT_PROFILE",
    // NEW_PROFILE: "NEW_PROFILE",

    //application.app
    VIEW_APP: "VIEW_APP",
    DELETE_APP: "DELETE_APP",
    EDIT_APP: "EDIT_APP",
    ENTITLE_APP: "ENTITLE_APP",
    NEW_APP: "NEW_APP",
    ADMIN_APP: "ADMIN_APP",

    //application.rbac
    VIEW_ROLE: "VIEW_ROLE",
    ASSIGN_ROLE: "ASSIGN_ROLE",
    DELETE_ROLE: "DELETE_ROLE",
    EDIT_ROLE: "EDIT_ROLE",
    NEW_ROLE: "NEW_ROLE",

    //audit
    // VIEW_AUDIT_LOG: "VIEW_AUDIT_LOG",

    //settings
    // VIEW_SYSTEM_SETTINGS: "VIEW_SYSTEM_SETTINGS",
    // EDIT_SYSTEM_SETTINGS: "EDIT_SYSTEM_SETTINGS",

    // tenant
    VIEW_TENANT: "VIEW_TENANT",
    DELETE_TENANT: "DELETE_TENANT",
    EDIT_TENANT: "EDIT_TENANT",
    ENTITLE_TENANT: "ENTITLE_TENANT",
    NEW_TENANT: "NEW_TENANT",
    ADMIN_TENANT: "ADMIN_TENANT",
};