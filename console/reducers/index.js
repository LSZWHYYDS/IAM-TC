/*jshint esversion: 6 */
import { combineReducers } from "redux";
import { LOGIN } from "../constants";
import login from "./login";
import home from "./home";
import user from "./user";
import view from "./view";
import templates from "./templates";
import app from "./app";

const appReducer = combineReducers({login, home, user, view, templates, app});
const rootReducer = (state, action) => {
    if (action.type === LOGIN.LOGOUT_SUCCESS || action.type === LOGIN.LOGOUT_FAILURE || action.type === LOGIN.LOGOUT_NOT_NOTIFY_SERVER) {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;