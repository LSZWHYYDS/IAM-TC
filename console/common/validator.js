/*jshint esversion: 6 */
import util from "./util";
const isIpV4 = function (rule, value, callback) {
    if (value && !(/^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/i).test(value) ) {
        callback(util.t("validate.ipFormatErr"));
    } else {
        callback();
    }
};
const isNameAndPwd = function (rule, value, callback) {
    let regExp;
    if (rule.field === "corporation") {
        regExp = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
    } else {
        regExp = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
    }
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.formatErr"));
    } else {
        callback();
    }
};
const isCustomizedPwd = function (customizeRules) {
    return function (rule, value, callback) {
        const regExpObj = {
            require_num: /\d/,
            require_spec_char: /[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^_\`\{\|\}\~]/,
            require_upper_char: /[A-Z]/,
            require_lower_char: /[a-z]/
        };

        if (value && customizeRules) {
            let mainArr = [], strArr = [];
            let lenPattern = new RegExp(`^.{${customizeRules.min_len},${customizeRules.max_len}}$`),
                spacePattern = /\s/;
            if (!lenPattern.test(value)) {
                if (customizeRules.min_len !== customizeRules.max_len) {
                    mainArr.push(util.t("common.lengthRange", {min: customizeRules.min_len, max: customizeRules.max_len}));
                } else {
                    mainArr.push(util.t("common.lengthCount", {count: customizeRules.min_len}));
                }
            }
            if (spacePattern.test(value)) {
                mainArr.push(util.t("validate.noSpace"));
            }
            for (let key in regExpObj) {
                if (regExpObj.hasOwnProperty(key) && customizeRules[key] === 1) {
                    if (!regExpObj[key].test(value)) {
                        switch(key) {
                        case "require_num":
                            strArr.push(util.t("common.digit"));
                            break;
                        case "require_spec_char":
                            strArr.push(util.t("common.specialChar"));
                            break;
                        case "require_upper_char":
                            strArr.push(util.t("common.uppercase"));
                            break;
                        case "require_lower_char":
                            strArr.push(util.t("common.lowercase"));
                        }
                    }
                }
            }
            if (strArr.length !== 0) {
                strArr[0] = util.t("common.containMore") + strArr[0];
                mainArr.push(strArr.join("、"));
            }
            if (mainArr.length === 0) {
                callback();
            } else {
                callback(mainArr.join("；"));
            }
        } else {
            callback();
        }
    };
};
const isPhoneNum = function (rule, value, callback) {
    const regExp = /^\+?[0-9]{4,16}$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.telFormatErr"));
    } else {
        callback();
    }
};
const isAccount = function (rule, value, callback) {
    const regExp = /^[0-9a-zA-Z_\.\@]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isAccount"));
    } else {
        callback();
    }
};
const isFieldName = function (rule, value, callback) {
    const regExp = /^[a-zA-Z][\w\_\-]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isFieldName"));
    } else {
        callback();
    }
};
const isUserName = function (rule, value, callback) {
    const regExp = /^[a-zA-Z][\w\_\-\.]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isUserName"));
    } else {
        callback();
    }
};
const isUserNamePrefix = function (rule, value, callback) {
    const regExp = /^[a-zA-Z][\w\_\-\.\\]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isUserNamePrefix"));
    } else {
        callback();
    }
};
const isUserNameSuffix = function (rule, value, callback) {
    const regExp = /^[\w\_\-\.\\]+[a-zA-Z]$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isUserNameSuffix"));
    } else {
        callback();
    }
};
const isName = function (rule, value, callback) {
    const regExp = /^[\w\.\-\(\)\u2010-\u9fa5\s\uff01-\uffe5]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.noSpecChar"));
    } else {
        callback();
    }
};
const isTagName = function (rule, value, callback) {
    const regExp = /^[^/\\<>#%{}|~\[\]`;?:@=&]*$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isTagName"));
    } else {
        callback();
    }
};
const isProfileName = function (rule, value, callback) {
    const regExp = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,50}$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isProfileName"));
    } else {
        callback();
    }
};
const isCenterName = function (rule, value, callback) {
    const regExp = /^[0-9a-zA-Z\u2010-\u9fa5\uff01-\uffe5\_\-\s]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isCenterName"));
    } else {
        callback();
    }
};
const isProgID = function (rule, value, callback) {
    const regExp = /^[\w][-\w]*(\.[-\w]+)*$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isProgID"));
    } else {
        callback();
    }
};
const isHost = function (rule, value, callback) {
    const regExp = /^(https?:\/\/)?((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$|^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61})?\.?)+[a-zA-Z]+$/i;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isHost"));
    } else {
        callback();
    }
};
const isPort = function (rule, value, callback) {
    const intValue = parseInt(value, 10);
    const regExp = /^[0-9]{1,5}$/;
    if (value && !(regExp.test(value) && intValue >= 0 && intValue <= 65535)) {
        callback(util.t("validate.isPort"));
    } else {
        callback();
    }
};
const isUrl = function (rule, value, callback) {
    const regExp = /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?((?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))))(?::\d{2,5})?(?:[\/?#]\S*)?$/;
    if (value && !(regExp.test(value))) {
        callback(util.t("validate.urlErr"));
    } else {
        callback();
    }
};
const isServer = function (rule, value, callback) {
    const regExp = /^[\w]+(\.[\w]+)+$/;
    if (value && !(regExp.test(value))) {
        callback(util.t("validate.isServer"));
    } else {
        callback();
    }
};
const isRedirectUri = function(app_type) {
    return function (rule, value, callback) {
        const regExpMap = {
            "NATIVE": /^http:\/\/localhost([:\/]{1}.*)?$|^(?!http)[a-zA-Z\.\-\_]+:\/\/[0-9a-zA-Z\.]+.*$/,
            "SPA":/^https?:\/\/(?!localhost).*$/,
            "WEB":/^https?:\/\/.+$/
        };
        if (value && !(regExpMap[app_type.toUpperCase()].test(value))) {
            callback(util.t("validate.urlErr"));
        } else {
            callback();
        }
    };
};
const isWebHookUri = function(app_type) {
    return function (rule, value, callback) {
        const regExpMap = {
            "NATIVE": /^http:\/\/localhost([:\/]{1}.*)?$|^(?!http)[a-zA-Z\.\-\_]+:\/\/[0-9a-zA-Z\.]+.*$/,
            "SPA":/^https?:\/\/(?!localhost).*$/,
            "WEB":/^https?:\/\/.+$/
        };
        if (value == '') {
            callback(util.t("validate.required"));
        } else if (value && !(regExpMap[app_type.toUpperCase()].test(value))) {
            callback(util.t("validate.urlErr"));
        } else {
            callback();
        }
    };
};
const isSearch = function(minLength=2) {
    return function (rule, value, callback) {
        if (value) {
            let len = value.trim().length;
            if (len > 0 && len < minLength) {
                callback(util.t("common.minLength", {count: minLength}));
            } else {
                callback();
            }
        } else {
            callback();
        }
    };
};
const maxLength = function (length) {
    return function (rule, value, callback) {
        if (value) {
            let len = value.trim().length;
            if (len > length) {
                callback(util.t("common.maxLength", {count: length}));
            } else {
                callback();
            }
        } else {
            callback();
        }
    };
};
const minLength = function (length) {
    return function (rule, value, callback) {
        if (value) {
            let len = value.trim().length;
            if (len < length) {
                callback(util.t("common.minLength", {count: length}));
            } else {
                callback();
            }
        } else {
            callback();
        }
    };
};
const lengthRange = function (min, max) {
    return function (rule, value, callback) {
        if (value) {
            let len = value.trim().length;
            if (len < min || len > max) {
                callback(util.t("common.lengthRange", {min: min, max: max}));
            } else {
                callback();
            }
        } else {
            callback();
        }

    };
};
const numberRange = function (min, max) {
    return function (rule, value, callback) {
        if (value) {
            let num = parseInt(value, 10);
            if (num < min ||  max !== null && num > max) {
                callback(util.t("common.numberRange", {min: min, max: max}));
            } else {
                callback();
            }
        } else {
            callback();
        }

    };
};
const isEqual = function (obj, fieldName) {
    return function (rule, value, callback) {
        if (value !== obj.getFieldValue(fieldName)) {
            callback(util.t("validate.isEqual"));
        } else {
            callback();
        }
    };
};
/**
 * a null-safe validator to replace null.
 */
const alwaysValid = function () {
    return function () {
    };
};
const listener = function (fn) {
    return function (rule, value, callback) {
        fn && fn();
        callback();
    };
};
const isDomainName = function (rule, value, callback) {
    const regExp = /^[a-zA-Z]+[0-9a-zA-Z]*$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isDomainName"));
    } else {
        callback();
    }
};
const isLinkerName = function (rule, value, callback) {
    const regExp = /^[^\\\/]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isLinkerName"));
    } else {
        callback();
    }
};
const isSignature = function (rule, value, callback) {
    const regExp = /^[^\-\.\+\#]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isSignature"));
    } else {
        callback();
    }
};
const isClientID = function (rule, value, callback) {
    const regExp = /^[a-zA-Z\d\-\_]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isFieldName"));
    } else {
        callback();
    }
};
const isPermName = function (rule, value, callback) {
    const regExp = /^[a-zA-Z\d\-\_:]+$/;
    if (value && !regExp.test(value) ) {
        callback(util.t("validate.isFieldName"));
    } else {
        callback();
    }
};
const isEmail = function (rule, value, callback) {
    console.log("isEmail");
    const regExp = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if (value && !regExp.test(value) ) {
        callback("请输入合法邮箱");
    } else {
        callback();
    }
};

let validator = {
    required: {
        rules: [{
            required: true,
            message: util.t("validate.required")
        }],
        trigger: ["onBlur", "onChange"]
    },
    maxLength(len){
        return {
            rules: [{
                validator: maxLength(len)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    minLength(len){
        return {
            rules: [{
                validator: minLength(len)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    lengthRange(min, max) {
        return {
            rules: [{
                validator: lengthRange(min, max)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    numberRange(min, max) {
        return {
            rules: [{
                validator: numberRange(min, max)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    listener(fn) {
        return {
            rules: [{
                validator: listener(fn)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    changeListener(fn) {
        return {
            rules: [{
                validator: listener(fn)
            }],
            trigger: ["onChange"]
        };
    },
    isEqual(obj, fieldName) {
        return {
            rules: [{
                validator: isEqual(obj, fieldName)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    isFieldName: {
        rules: [{
            validator: isFieldName
        }],
        trigger: ["onBlur", "onChange"]
    },
    isUserName: {
        rules: [{
            validator: isUserName
        }],
        trigger: ["onBlur", "onChange"]
    },
    isUserNamePrefix: {
        rules: [{
            validator: isUserNamePrefix
        }],
        trigger: ["onBlur", "onChange"]
    },
    isUserNameSuffix: {
        rules: [{
            validator: isUserNameSuffix
        }],
        trigger: ["onBlur", "onChange"]
    },
    isTagName: {
        rules: [{
            validator: isTagName
        }],
        trigger: ["onBlur", "onChange"]
    },
    isProfileName: {
        rules: [{
            validator: isProfileName
        }],
        trigger: ["onBlur", "onChange"]
    },
    /**
     * a null-safe validator to replace null
     */
    alwaysValid: {
        rules: [{
            validator: alwaysValid
        }],
        trigger: ["onBlur", "onChange"]
    },
    isServer: {
        rules: [{
            validator: isServer
        }],
        trigger: ["onBlur", "onChange"]
    },
    isCenterName: {
        rules: [{
            validator: isCenterName
        }],
        trigger: ["onBlur", "onChange"]
    },
    isIpV4: {
        rules: [{
            validator: isIpV4
        }],
        trigger: ["onBlur", "onChange"]
    },
    isNameAndPwd: {
        rules: [{
            validator: isNameAndPwd
        }],
        trigger: ["onBlur", "onChange"]
    },
    isEmail: {
        rules: [{
            validator: isEmail
        }],
        trigger: ["onBlur", "onChange"]
    },
    isCustomizedPwd(customizeRules) {
        return {
            rules: [{
                validator: isCustomizedPwd(customizeRules)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    isAccount: {
        rules: [{
            validator: isAccount
        }],
        trigger: ["onBlur", "onChange"]
    },
    isPhoneNum: {
        rules: [{
            validator: isPhoneNum
        }],
        trigger: ["onBlur", "onChange"]
    },
    isName: {
        rules: [{
            validator: isName
        }],
        trigger: ["onBlur", "onChange"]
    },
    isProgID: {
        rules: [{
            validator: isProgID
        }],
        trigger: ["onBlur", "onChange"]
    },
    isHost: {
        rules: [{
            validator: isHost
        }],
        trigger: ["onBlur", "onChange"]
    },
    isPort: {
        rules: [{
            validator: isPort
        }],
        trigger: ["onBlur", "onChange"]
    },
    isUrl: {
        rules: [{
            validator: isUrl
        }],
        trigger: ["onBlur", "onChange"]
    },
    isRedirectUri(app_type) {
        return {
            rules: [{
                validator: isRedirectUri(app_type)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    isWebHookUri(app_type) {
        return {
            rules: [{
                required: true,
                validator: isWebHookUri(app_type)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    isSearch(minLength=2) {
        return {
            rules: [{
                validator: isSearch(minLength)
            }],
            trigger: ["onBlur", "onChange"]
        };
    },
    isDomainName: {
        rules: [{
            validator: isDomainName
        }],
        trigger: ["onBlur", "onChange"]
    },
    isLinkerName: {
        rules: [{
            validator: isLinkerName
        }],
        trigger: ["onBlur", "onChange"]
    },
    isSignature: {
        rules: [{
            validator: isSignature
        }],
        trigger: ["onBlur", "onChange"]
    },
    isClientID: {
        rules: [{
            validator: isClientID
        }],
        trigger: ["onBlur", "onChange"]
    },
    isPermName: {
        rules: [{
            validator: isPermName
        }],
        trigger: ["onBlur", "onChange"]
    },
};

export default validator;