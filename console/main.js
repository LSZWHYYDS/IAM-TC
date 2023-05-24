/*jshint esversion: 6 */
import React from "react";
import { render } from "react-dom";
import { Route, HashRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import mainStore from "./store/mainStore";
import AppContainer from "./app";

let rootElement = document.getElementById("root");
let cssLink = document.createElement("link");
cssLink.rel = "shortcut icon";
cssLink.href = require("./img/favicon.ico");
document.head.appendChild(cssLink);
require("es6-promise").polyfill();

render(
    <Provider store={mainStore}>
        <Router basename="/">
            <Route component={AppContainer} />
        </Router>
    </Provider>,
    rootElement
);
