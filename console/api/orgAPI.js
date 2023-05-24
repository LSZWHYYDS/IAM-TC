/**
 * Created by tianyun on 2016/12/21.
 */
/*jshint esversion: 6 */
import axios from "axios";
import util from "../common/util";

let orgAPI = {
    getOrgTree() {
        return axios.get("/orgs/_root/subs?depth=0&attrs=id,name,description,readonly");
    },
    getFullOrgTree(){
        return axios.get("/orgs/_root/subs?depth=0&attrs=id,name,description,readonly&type=no_scope");
    },
    getOrg(id) {
        const params = {
            attrs: "id,name,description,readonly,num_of_users,num_of_children",
        };

        return axios.get("orgs/" + id + util.createQueryString(params));
    },
    addOrg(params) {
        return axios.post("orgs", params);
    },
    editOrg(id, params) {
        return axios.patch("orgs/" + id, params);
    },
    deleteOrg(id) {
        return axios.delete("orgs/" + id);
    }
};

export default orgAPI;
