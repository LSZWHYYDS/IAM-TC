/*jslint browser: true, devel: true*/
/*global window, exports, module, define*/
(function () {
    "use strict";
    var staticMethod = {
        clearWebAuth: function (callback) {
            localStorage.removeItem("access_token_tc");
            localStorage.removeItem("id_token_tc");
            localStorage.removeItem("expires_in");
            localStorage.removeItem("access_token_received_at");
            if (typeof callback === "function") {
                callback();
            }
        },
        parseIDToken: function (idToken) {
            var payload = idToken.split(".")[1];
            function base64urlDecode(str) {
                return window.atob(str.replace(/_/g, "/").replace(/-/g, "+"));
            }
            //base64url decode
            payload = base64urlDecode(payload);

            return JSON.parse(decodeURIComponent(window.escape(payload)));
        },
        createQueryString: function (params) {
            var str = "?",
                param;
            for (param in params) {
                if (params.hasOwnProperty(param) && params[param]) {
                    str = str + param + "=" + encodeURIComponent(params[param]) + "&";
                }
            }
            return str.slice(0, -1);
        },
        parseQueryString: function (url, callback) {
            var i, len, result, pair, queryObj = {};
            result = (url || location.search).match(/[\?\&\#][^\?\&\#]+=[^\?\&\#]+/g);
            if (result !== null) {
                for (i = 0, len = result.length; i < len; i += 1) {
                    pair = result[i].slice(1).split("=");
                    queryObj[pair[0]] = decodeURIComponent(pair[1]);
                }
            }
            if (typeof callback === "function") {
                callback(queryObj);
            }
        },
        handleRedirectError: function (callback) {
            var href = window.location.href, error;
            this.parseQueryString(href, function (params) {
                error = params.error;
                if (error && typeof callback === "function") {
                    if (["invalid_request", "invalid_client",
                            "invalid_grant", "unauthorized_client",
                            "unsupported_grant_type", "invalid_scope"
                            ].indexOf(error) !== -1) {
                        callback(error, params.error_description);
                    }
                }
            });
        },
        getAccessToken: function () {
            if (localStorage.getItem("access_token_tc")) {
                return localStorage.getItem("access_token_tc");
            }
            throw new Error("Error! There is no access token");
        },
        getIdToken: function () {
            if (localStorage.getItem("id_token_tc")) {
                return localStorage.getItem("id_token_tc");
            }
            throw new Error("Error! There is no id token");
        }
    };
    function WebAuth(options) {
        this.ucSsoUrl = options.ucSsoUrl;
        this.responseType = options.responseType || "token";
        this.clientId = options.clientId;
        this.redirectUri = options.redirectUri;
        this.scope = options.scope;
    }
    WebAuth.prototype.authorize = function (beforeAuthorizeCb) {

        var state = new Date().getTime(), params = {
            response_type: this.responseType,
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope,
            state: state
        };
        if (!localStorage.getItem("state")) {
            localStorage.setItem("state", state);
            staticMethod.clearWebAuth();
            if (typeof beforeAuthorizeCb === "function") {
                beforeAuthorizeCb();
            }
            staticMethod.parseQueryString(window.location.href, function (queryObj) {
                params = Object.assign(queryObj, params);
            });
            location.href = this.ucSsoUrl + "/authorize" + staticMethod.createQueryString(params);   
        }
    };
    WebAuth.prototype.initWebAuth = function (successCb, failureCb) {
        var that = this;
        staticMethod.parseQueryString(window.location.href, function (queryObj) {
            var accessToken, idToken, accessTokenReceivedAt, accessTokenNow, expiresIn, state, localState;
            accessToken = queryObj.access_token;
            state = queryObj.state;
            localState = localStorage.getItem("state");
            localStorage.removeItem("state");
            if (accessToken) {
                if (!localState || localState === state) {
                    idToken = queryObj.id_token;
                    expiresIn = parseInt(queryObj.expires_in, 10) * 1000;
                    accessTokenReceivedAt = new Date().getTime();
                    localStorage.setItem("access_token_tc", accessToken);
                    localStorage.setItem("id_token_tc", idToken);
                    localStorage.setItem("expires_in", expiresIn);
                    localStorage.setItem("access_token_received_at", accessTokenReceivedAt);
                    if (typeof successCb === "function") {
                        successCb(accessToken, idToken, accessTokenReceivedAt, expiresIn);
                    }
                } else {
                    if (typeof failureCb === "function") {
                        failureCb("invalid_state", "invalid_state");
                    }
                }
            } else {
                accessToken = localStorage.getItem("access_token_tc");
                if (accessToken) {
                    expiresIn = parseInt(localStorage.getItem("expires_in"), 10);
                    accessTokenReceivedAt = parseInt(localStorage.getItem("access_token_received_at"), 10);
                    idToken = localStorage.getItem("id_token_tc");
                    accessTokenNow = new Date().getTime();
                    if (accessTokenReceivedAt + expiresIn < accessTokenNow) {//失效
                        if (typeof failureCb === "function") {
                            failureCb("access_token_expire", "access_token_expire");
                        }
                        that.authorize();
                    } else {
                        if (typeof successCb === "function") {
                            successCb(accessToken, idToken, accessTokenReceivedAt, expiresIn);
                        }
                    }
                } else {
                    if (typeof failureCb === "function") {
                        failureCb("no_access_token", "no_access_token");
                    }
                    if (! queryObj.error) {
                        that.authorize();
                    }
                }
            }
        });
    };
    module.exports = {
        WebAuth: WebAuth,
        staticMethod: staticMethod
    };
})();
