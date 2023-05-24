/**
 * Created by xifeng on 2018/01/08.
 * console view, is in admin view or selfservice view ?
 */
/*jshint esversion: 6 */
import { VIEW } from "../constants";

const defaultView = {
    adminView: localStorage.getItem("view") === "admin" ? true : false,
};

const view = (state = defaultView, action) => {
    switch (action.type) {
    case VIEW.TOGGLE:
        localStorage.setItem("view", (state.adminView ? "selfservice" : "admin"));

        return Object.assign({}, {
            adminView: !state.adminView,
        });
    case VIEW.SET_ADMIN_VIEW:
        localStorage.setItem("view", "admin");
        return Object.assign({}, {
            adminView: true,
        });
    case VIEW.SET_SS_VIEW:
        localStorage.setItem("view", "selfservice");
        return Object.assign({}, {
            adminView: false,
        });
    case VIEW.STAY_WITH_PREVIOUS_VIEW:
        return state;
    default:
        return state;
    }
};

export default view;