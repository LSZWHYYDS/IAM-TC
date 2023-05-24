/*jshint esversion: 6 */
// Authorization HOC

import { staticMethod } from "./webAuth";
import { PERM_SETS } from "../constants";

const idtoken = () => {
    const tokenstr = localStorage.getItem("id_token_tc");
    if (tokenstr) {
        const userIdentity = staticMethod.parseIDToken(tokenstr);
        return  userIdentity;
    }else {
        return {};
    }
};

const whoami = () => {
    const tokenobj = idtoken();
    return tokenobj.username || "";
};

const getUserRoles= () => {
    const tokenobj = idtoken();
    return tokenobj.roles || [];
};

const hasAdminPerm = () => {
    const roles = getUserRoles();

    return !!(roles && roles.length);
};

const isSuperAdmin = () => {
    const roles = getUserRoles();
    return !!(roles && roles.length && roles.some(role => role.name === "SUPER_ADMIN"));
};

const isSystemUser = (userinfo)  => {
    return userinfo && userinfo.created_mode && userinfo.created_mode.toUpperCase() === "BY_SYSTEM";
};

/**
 * check if current user has the permission set to do something.
 * @param {string[]} allows allowed permission sets
 * @param {string[]} has the perm sets of current user has
 * @param {string} op operation type. "or" for a logic OR, "and" for a logic AND
 */
const authorized = (allows, has, op="or") => {
    if (has == null) {
        return false;
    }
    switch(op) {
    case "or":
        return has.includes(PERM_SETS.SUPER_ADMIN) || allows.some(ps =>  has.includes(ps));
    case "and":
        return has.includes(PERM_SETS.SUPER_ADMIN) || allows.every(ps => has.includes(ps));
    default:
        return false; //unknow operation type.
    }
};

export { authorized, idtoken, whoami, isSystemUser, isSuperAdmin, hasAdminPerm, getUserRoles };