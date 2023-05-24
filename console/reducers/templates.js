/**
 * Created by tianyun on 2016/12/28.
 */
/*jshint esversion: 6 */
import update from "immutability-helper";
import { TEMPLATE } from "../constants";
import util from "../common/util";

const templates = (state = {
    templates: {}
}, action) => {
    switch (action.type) {
    case TEMPLATE.GET_TEMPLATES_SUCCESS:
        return Object.assign({}, state, {
            templates: action.response.data && action.response.data.data
        });
    case TEMPLATE.GET_TEMPLATES_FAILURE:
        util.showErrorMessage(action.error);
        return state;
    case TEMPLATE.SET_TEMPLATE_SUCCESS:
        util.showSuccessMessage();
        return update(state, {templates: {[action.tmplName]: {$merge: action.params}}});
    case TEMPLATE.SET_TEMPLATE_FAILURE:
        util.showErrorMessage(action.error);
        return state;
    default:
        return state;
    }
};

export default templates;