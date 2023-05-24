/**
 * Created by tianyun on 2016/12/28.
 */
/*jshint esversion: 6 */
import { TEMPLATE } from "../constants";
import templateAPI from "../api/templateAPI";

let templateActionCreators = {
    getTemplates() {
        return (dispatch) => {
            dispatch({type: TEMPLATE.GET_TEMPLATES_REQUEST});
            templateAPI.getTemplates().then(
                (response) => {
                    dispatch({
                        type: TEMPLATE.GET_TEMPLATES_SUCCESS,
                        response
                    });
                },
                (error) => dispatch({
                    type: TEMPLATE.GET_TEMPLATES_FAILURE,
                    error
                })
            );
        };
    },
    setTemplates(tmplName, params) {
        return (dispatch) => {
            dispatch({type: TEMPLATE.SET_TEMPLATE_REQUEST});
            return templateAPI.updateTemplate(tmplName, params).then(
                () => {
                    dispatch({
                        type: TEMPLATE.SET_TEMPLATE_SUCCESS,
                        tmplName,
                        params
                    });
                },
                (error) => dispatch({
                    type: TEMPLATE.SET_TEMPLATE_FAILURE,
                    error
                })
            );
        };
    }
};

export default templateActionCreators;
