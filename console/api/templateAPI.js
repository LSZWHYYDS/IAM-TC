/**
 * Created by tianyun on 2016/12/28.
 */
/*jshint esversion: 6 */
import axios from "axios";

let templateAPI = {
    getTemplates() {
        return axios.get("/templates");
    },
    getTemplate(tmplName) {
        return axios.get("/templates/" + tmplName);
    },
    updateTemplate(tmplName, params) {
        return axios.patch("/templates/" + tmplName, params);
    }
};

export default templateAPI;