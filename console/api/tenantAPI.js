import axios from "axios";
import util from "../common/util";

let tenantAPI = {
  getTenantsList(params = {page: 0, size: 10}) {
    return axios.get("/tenants" + util.createQueryString(params));
  },
  createTenant(params) {
    return axios.post("/tenants", params);
  },
  updateTenant(params, id) {
    return axios.post("/tenants/" + id, params)
  },
  updateTenantPass(params) {
    return axios.post("/resetAdminPwd" + util.createQueryString(params));
  },
  getTenant(id) {
    return axios.get("/tenants/" + id)
  },
  delTenant(id) {
    return axios.delete("/tenants/" + id)
  }
}

export default tenantAPI;