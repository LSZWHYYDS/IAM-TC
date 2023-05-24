/**
 * Created by shaliantao on 2017/8/31.
 */
/*jshint esversion: 6 */
import util from "./util";
import defaultCli from "../img/cli.png";
import defaultNative from "../img/native.png";
import defaultTrusted from "../img/trusted.png";
import defaultWeb from "../img/web.png";
import defaultSpa from "../img/spa.png";
import defaultApp from "../img/default-app-icon.png";

export const app = {
    getAppType(appType) {
        const map = {
            "ALL": util.t("common.all"),
            "NATIVE": "Native App",
            "TRUSTED": "Trusted App",
            "SPA": "Single Page App",
            "WEB": "Web App",
            "CLI": "CLI App"
        };
        return map[appType && appType.toUpperCase()] || "--";
    },
    getStatus(status) {
        const map = {
            "ALL": util.t("common.all"),
            "ACTIVE": util.t("common.enabled"),
            "INACTIVE": util.t("common.inactive")
        };
        return map[status && status.toUpperCase()] || "--";
    },
    getDefaultAppIcon(appType) {
        const map = {
            "NATIVE": defaultNative,
            "TRUSTED": defaultTrusted,
            "CLI": defaultCli,
            "WEB": defaultWeb,
            "SPA": defaultSpa
        };
        return map[appType && appType.toUpperCase()] || defaultApp;
    },
    getCheckboxStatus(enabled) {
        return enabled ? util.t("common.enabled") : util.t("common.disabled");
    }
};