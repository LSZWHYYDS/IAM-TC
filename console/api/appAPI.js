/**
 * Created by shaliantao on 2017/8/24.
 */
/*jshint esversion: 6 */
import axios from "axios";
import util from "../common/util";
import conf from "../conf";

let appAPI = {
  getList(params) {
    return axios.get("/apps" + util.createQueryString(params));
  },
  getApp(id) {
    return axios.get("/apps/" + id);
  },
  pushAppData(params) {
    axios.defaults.baseURL = conf.getServiceUrl2();
    return axios.get("/push" + util.createQueryString(params));
  },
  add(params) {
    return axios.post("/apps", params);
  },
  edit(id, params) {
    return axios.post("/apps/" + id, params);
  },
  delete(id) {
    return axios.delete("/apps/" + id);
  },
  generateSecret(id) {
    return axios.patch("/apps/" + id + "/secret");
  },
  changeStatus(id, newStatus) {
    return axios.put("/apps/" + id + "/status", { status: newStatus });
  },
  getSelfList(params) {
    return axios.get("/self/apps" + util.createQueryString(params));
  },
  cancelAuthorization(auth_id) {
    return axios.delete("/self/apps/auth/" + auth_id);
  },
  getExtraAuthFactorAttrList() {
    return axios.get("/user_attrs?extra_auth_factor=true&page=1&size=100");
  },

  //app entitlement
  getEntitledUsers(params) {
    params.attrs = "sub,name,email,username,phone_number,picture";
    const { id } = params;
    delete params.id;
    return axios.get("/apps/" + id + "/users" + util.createQueryString(params));
  },

  //entitle user(s) with permission to use the specified app
  entitleUsers(params) {
    const { id } = params;
    delete params.id;
    return axios.post("/apps/" + id + "/users/add", params);
  },

  removeUserEntitlement(params) {
    const { id } = params;
    delete params.id;
    return axios.post("/apps/" + id + "/users/remove", params);
  },

  //app entitlement
  getEntitledTags(params) {
    const { id } = params;
    delete params.id;
    return axios.get("/apps/" + id + "/tags");
  },

  //entitle user(s) with permission to use the specified app
  entitleTags(params) {
    const { id } = params;
    delete params.id;
    return axios.post("/apps/" + id + "/tags/add", params);
  },

  removeTagEntitlement(params) {
    const { id } = params;
    delete params.id;
    return axios.post("/apps/" + id + "/tags/remove", params);
  },

  /**
   * get the entire org tree, but with app entitlement info
   * @param {string} id
   */
  getEntitledOrgTree(id) {
    return axios.get("/apps/" + id + "/orgs");
  },

  /**
   * add the app entitlement of an org
   * @param {object} params
   */
  addOrgEntitlement(params) {
    const { id, org_id: orgId } = params;
    return axios.post("/apps/" + id + "/orgs/" + orgId);
  },

  /**
   * remove the app entitlement of an org
   * @param {object} params
   */
  removeOrgEntitlement(params) {
    const { id, org_id: orgId } = params;
    return axios.delete("/apps/" + id + "/orgs/" + orgId);
  },

  enablePublicAccess(id, value) {
    return axios.put("/apps/" + id + "/public_access", { enabled: value });
  },

  getAppPerms(params) {
    const { client_id } = params;
    delete params.client_id;
    return axios.get("/apps/" + client_id + "/permissions" + util.createQueryString(params));
  },

  addPerm(params) {
    const { client_id } = params;
    delete params.client_id;
    return axios.post("/apps/" + client_id + "/permissions", params);
  },

  removePerm(params) {
    const { client_id, perm } = params;
    return axios.delete("/apps/" + client_id + "/permissions/" + perm);
  },

  editPerm(params) {
    const { client_id, name } = params,
      mods = {
        description: params.description,
        display_name: params.display_name,
        payload: params.payload,
      };

    return axios.patch("/apps/" + client_id + "/permissions/" + name, mods);
  },
  getPermSet(params) {
    const { client_id } = params;
    delete params.client_id;
    return axios.get("/apps/" + client_id + "/permission_sets" + util.createQueryString(params));
  },
  addPermSet(params) {
    const { client_id } = params,
      mods = {
        name: params.name,
        description: params.description,
        display_name: params.display_name,
        permissions: params.permissions,
      };
    return axios.post("/apps/" + client_id + "/permission_sets", mods);
  },
  editPermSet(params) {
    const { client_id, name } = params,
      mods = {
        description: params.description,
        display_name: params.display_name,
        permissions: params.permissions,
      };

    return axios.patch("/apps/" + client_id + "/permission_sets/" + name, mods);
  },
  removePermSet(params) {
    const { client_id, name } = params;
    return axios.delete("/apps/" + client_id + "/permission_sets/" + name);
  },
  getAppRoles(params) {
    const { id } = params;
    delete params.id;
    return axios.get("/apps/" + id + "/roles" + util.createQueryString(params));
  },

  addRole(params) {
    const { client_id } = params,
      mods = {
        name: params.name,
        description: params.description,
        display_name: params.display_name,
        permissions: params.permissions || [],
        permission_sets: params.permission_sets || [],
      };
    return axios.post("/apps/" + client_id + "/roles", mods);
  },

  removeRole(params) {
    const { id, role } = params;
    return axios.delete("/apps/" + id + "/roles/" + role);
  },

  editRole(params) {
    const { client_id, name } = params,
      mods = {
        description: params.description,
        display_name: params.display_name,
        permissions: params.permissions || [],
        permission_sets: params.permission_sets || [],
      };

    return axios.patch("/apps/" + client_id + "/roles/" + name, mods);
  },

  /**
   * get the role binding users
   * @param {object} params      */
  getRoleBindingUsers(params) {
    const { client_id, role_name } = params;
    params.attrs = "sub,username,picture,email,phone_number,name";
    delete params.client_id;
    delete params.role_name;
    return axios.get("/apps/" + client_id + "/roles/" + role_name + "/users" + util.createQueryString(params));
  },

  getRoleBindingOrgs(params) {
    const { client_id, role_name } = params;
    delete params.client_id;
    delete params.role_name;
    return axios.get("/apps/" + client_id + "/roles/" + role_name + "/orgs" + util.createQueryString(params));
  },

  getRoleBindingTags(params) {
    const { client_id, role_name } = params;
    delete params.client_id;
    delete params.role_name;
    return axios.get("/apps/" + client_id + "/roles/" + role_name + "/tags" + util.createQueryString(params));
  },

  bindOrgWithRole(params, payload) {
    const { client_id, role } = params;

    return axios.post("/apps/" + client_id + "/roles/" + role + "/orgs/", payload);
  },

  unbindOrgWithRole(params) {
    const { client_id, role, org_id } = params;
    return axios.delete("/apps/" + client_id + "/roles/" + role + "/orgs" + util.createQueryString({ org_id }));
  },
  bindUserWithRole(params, payload) {
    const { client_id, role } = params;

    return axios.post("/apps/" + client_id + "/roles/" + role + "/users/", payload);
  },

  unbindUserWithRole(params) {
    const { client_id, role, username } = params;
    return axios.delete("/apps/" + client_id + "/roles/" + role + "/users" + util.createQueryString({ username }));
  },

  editBindingScopeForUser(params, mods) {
    const { client_id, role, username } = params;
    return axios.patch("/apps/" + client_id + "/roles/" + role + "/users" + util.createQueryString({ username }), mods);
  },

  bindTagWithRole(params, payload) {
    const { client_id, role } = params;

    return axios.post("/apps/" + client_id + "/roles/" + role + "/tags/", payload);
  },

  unbindTagWithRole(params) {
    const { client_id, role, tag_name } = params;
    return axios.delete("/apps/" + client_id + "/roles/" + role + "/tags" + util.createQueryString({ tag_name }));
  },

  editBindingScopeForTag(params, mods) {
    const { client_id, role, tag_name } = params;
    return axios.patch("/apps/" + client_id + "/roles/" + role + "/tags" + util.createQueryString({ tag_name }), mods);
  },
  /**
   * get role detail information which includes its binding perms and permission sets
   * @param {string} clientId id
   * @param {string} roleName name
   */
  getRoleDetail(clientId, roleName) {
    return axios.get("/apps/" + clientId + "/roles/" + roleName);
  },

  uploadAppList(params) {
    // return axios.post('https://192-168-50-17-75uievyndse8.ztna.dingtalk.com/iam/api/apps/createOrUpdateAppBaseInfo', params);
    return axios.post(`/apps/createOrUpdateAppBaseInfo`, params);
  }
};

export default appAPI;
