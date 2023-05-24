/*jslint browser: true, devel: true*/
/*jshint esversion: 6 */
/*global window, exports, module */
(function () {
    "use strict";
    var util = {
        Ajax : {
            post: function (url, data, successcb, errorcb) {
                var req = new XMLHttpRequest();
                req.open("POST", url, true);
                req.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                req.setRequestHeader("Accept", "application/json; charset=UTF-8");
                req.withCredentials = true;//ensure UCSSO can be set in case of qrcode is in a different domain than UC-SSO

                req.onreadystatechange = function() {
                    if (req.readyState == 4) {
                        if (req.status == 200 || req.status == 304) {
                            successcb && successcb.call(this, JSON.parse(req.responseText));
                        } else {
                            errorcb && errorcb.call(this, JSON.parse(req.responseText));
                        }
                    }
                };

                req.send(util.postFormParams(data,true));
            }
        },
        /**
         * aseemble data into form post params
         */
        postFormParams: function (data, ignoreEmpty) {
            let params = "";
            for (const k in data) {
                if (data.hasOwnProperty(k)) {
                    const value = data[k];
                    if (ignoreEmpty && !value) {
                        continue;
                    }
                    params += ("&" + k + "="+ encodeURIComponent(data[k])) ;
                }
            }

            //strip the very first &
            return params.substring(1);
        },
    };

    /**
     * a QR Code Login Object
     * @param {*} uc sso server fqdn
     * @param {*} options client info options
     * @param {*} container dom element of where the qr code is displayed
     */
    function QRCodeLogin(uc, options, container) {
        this.uc = uc;
        this.options = Object.assign({}, options);
        this.container = container;

        this._response = {};
    }

    //show QR Code
    QRCodeLogin.prototype.showQRCode= function (data, container) {
        container.innerHTML = "";
        //NOTE: needs to import qrcode.min.js first.
        new QRCode(container, {
            text: data,
            width: 150,
            height: 150,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        const img = container.querySelector("img");
        //img.style.margin = "60px 60px";
        img.style.opacity = "1";
    },

    /**
     * QRCode authorize request
     */
    QRCodeLogin.prototype.authorize = function () {
        //any further response result.
        this._response = {};

        const data = Object.assign({}, this.options);

        // issue a QRCode login request.
        util.Ajax.post(this.uc + "/devicecode" , data , 
        data => {
            this._response.device_code = data.device_code;
            this._response.expires_in = data.expires_in || 300;
            this._response.interval = (data.interval || 5) * 1000;

            //when the response is received.
            this._response.received_at = Date.now();
            const clockSkew = 10 * 1000; //10 seconds.

            //when the response expired
            this._response.expired_at = new Date(this._response.received_at + this._response.expires_in * 1000 + clockSkew).getTime();

            if (data.verification_uri && data.user_code) {
                const url = data.verification_uri + "?user_code=" + encodeURIComponent(data.user_code);
                this.showQRCode(url, this.container);

                //poll binding.
                this.pollBinding(this.options.client_id, data.device_code);
            }
        }, err => {
            const {error, error_description} = err;
            this.container.innerHTML = "<div>" + error + ": " + error_description +"</div>";
        });
    },

    /**
     * periodically poll to see if the QRCode is bound.
     */
    QRCodeLogin.prototype.pollBinding = function (client_id, device_code) {
        const data = {
            grant_type : "urn:ietf:params:oauth:grant-type:device_code",
            device_code: device_code,
            client_id: client_id,
        };

        const uc = this.uc, container = this.container,
            authorize = this.authorize.bind(this),
            //poll timer object.
            poll = setInterval(query, this._response.interval,
                                this.uc,
                                this._response.expired_at);

        // handler for qr code expiration.
        function handleExpiration () {
            container.querySelector("img").style.opacity = ".1";
            clearInterval(poll);

            let refreshBtn = container.querySelector(".q-qrcode-refresh");
            if (!refreshBtn) {
                refreshBtn = document.createElement("img");
                refreshBtn.style = "cursor:pointer;position:absolute;margin: -150px 100px;height:60px;width:60px;";
                refreshBtn.src = uc + "/img/qrcode-refresh.png";
                refreshBtn.title = "刷新二维码";
                refreshBtn.classList.add("q-qrcode-refresh");
                container.appendChild(refreshBtn);

                refreshBtn.onclick = () => {
                    authorize();
                    refreshBtn.remove();
                };
            }
        }

        function query(uc, expiredAt) {
            const now = Date.now();
            if (now > expiredAt) {
                handleExpiration();
                return;
            }

            util.Ajax.post(uc + "/token", data , 
                data => {
                    if (data.redirect_uri) {
                        location.href = data.redirect_uri;
                        return;
                    }

                }, err => {
                    const {error} = err;
                    switch (error) {
                    case "invalid_request":
                    case "expired_token":
                        handleExpiration();
                        break;
                    case "authorization_pending":
                        //waiting for binding, which is an exptected GOOD err.
                        break;
                    default:
                        break;
                    }
                });
        }
    };

    module.exports = {
        QRCodeLogin: QRCodeLogin,
        util: util,
    };
})();
