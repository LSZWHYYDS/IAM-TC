/*jslint browser: true, devel: true*/
/*jshint esversion: 6 */
/*global window, exports, module */
(function () {
    "use strict";
    var util = {
        Ajax : {
            get: function (url, successcb, errorcb) {
                var req = new XMLHttpRequest();
                req.open("get", url, true);
                req.setRequestHeader("Accept", "application/json; charset=UTF-8");
                //req.withCredentials = true;//ensure UCSSO can be set in case of qrcode is in a different domain than UC-SSO

                req.onreadystatechange = function() {
                    if (req.readyState == 4) {
                        if (req.status == 200 || req.status == 304) {
                            successcb && successcb.call(this, JSON.parse(req.responseText));
                        } else {
                            errorcb && errorcb.call(this, JSON.parse(req.responseText));
                        }
                    }
                };

                req.send(null);
            }
        },
    };

    /**
     * Secure Object to encrypt values
     * 
     * @param {*} uc sso server fqdn
     * @param {*} options client info options
     */
    function Secure(uc, clientId) {
        this.uc = uc;
        this.client_id = clientId;
    }

    /**
     * For UC login, pass loginId and password, after password is encyrpted, do the specified "action" function with loginId and encryptedPassword
     * @param {*} loginId UC loginId
     * @param {*} password 
     * @param {*} action 
     */
    Secure.prototype.login = function (loginId, password, tcode, action, errorAction) {
        let url = this.uc + "/api/login_hello?client_id="+this.client_id+"&tcode="+tcode;
        
        util.Ajax.get(url ,
        data => {
            if (data.data.secure_login_enable){
                if (data.data.public_key){
                    const encrypt = new JSEncrypt();
                    encrypt.setPublicKey(data.data.public_key);
                    let encryptedPassword = encrypt.encrypt(data.data.nonce+"-"+password);
                    encryptedPassword = btoa(data.data.kid)+"."+encryptedPassword;
                    action(loginId, encryptedPassword, tcode);
                }else{
                    const errorObj = {error:"no_public_key", error_description:"应用需加密登录，但login_hello未生成公钥"};
                    errorAction(errorObj);
                }
            }else{//no secured password required
                action(loginId, password, tcode);
            }
        }, error => {
            errorAction(error);
        });
    };

    /**
     * encrypted function to encrypted the passed-in paramters
     * @param {*} password 
     * @param {*} action 
     */
    Secure.prototype.encrypt = function (valueToBeEncrypted, action, errorAction) {
        let url = this.uc + "/api/login_hello?client_id="+this.client_id;

        util.Ajax.get(url ,
        data => {
            if (data.data.secure_login_enable){
                if (data.data.public_key){
                    const encrypt = new JSEncrypt();
                    encrypt.setPublicKey(data.data.public_key);
                    let encryptedValue = encrypt.encrypt(data.data.nonce+"-"+valueToBeEncrypted);
                    encryptedValue = btoa(data.data.kid)+"."+encryptedValue;
                    action(encryptedValue);
                }else{
                    const errorObj = {error:"no_public_key", error_description:"应用需加密登录，但login_hello未生成公钥"};
                    errorAction(errorObj);
                }
            }else{//no secured password required
                action(valueToBeEncrypted);
            }
        }, error => {
            errorAction(error);
        });
    };

    module.exports = {
        Secure: Secure,
        util: util,
    };
})();
