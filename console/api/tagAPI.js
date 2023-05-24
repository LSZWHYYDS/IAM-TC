/**
 * Created by tianyun on 2016/12/21.
 */
/*jshint esversion: 6 */
import axios from "axios";
import util from "../common/util";

let tagAPI = {
    getTagList(params) {
        if (params){
            return axios.get("/tags" + util.createQueryString(params));
        }else{
            return axios.get("/tags");
        }
    },
    getTag(name) {
        return axios.get("/tags/" + name);
    },
    addTag(params) {
        return axios.post("/tags", params);
    },
    editTag(name, params) {
        return axios.patch("/tags/" + name, params);
    },
    deleteTag(name) {
        return axios.delete("/tags/" + name);
    },
    getTagUsers(params={page: 0, size: 20}) {
        const {name} = params;
        params.attrs = "sub,username,picture,email,phone_number,name";
        delete params.name;
        return axios.get("/tags/" + name + "/users" + util.createQueryString(params));
    },
    addUsersTag(name, payload) {
        return axios.post("/tags/" + name + "/users", payload);
    },
    removeUserTag(name, params) {
        return axios.delete("/tags/" + name + "/users" + util.createQueryString(params));
    },
};

export default tagAPI;
