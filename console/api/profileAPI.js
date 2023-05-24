/**
 * Created by shaliantao on 2017/6/29.
 */
/*jshint esversion: 6 */
import axios from "axios";
import util from "../common/util";

let profileAPI = {
    getProfileList(params = {page: 0, size: 10}) {
        return axios.get("profiles" + util.createQueryString(params));
    },
    getProfile(id) {
        return axios.get("profiles/" + id);
    },
    add(params) {
        return axios.post("profiles", params);
    },
    edit(id, params) {
        return axios.patch("profiles/" + id, params);
    },
    delete(id) {
        return axios.delete("profiles/" + id);
    }
};

export default profileAPI;
