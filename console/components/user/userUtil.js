/**
 * Created by tianyun on 2017/2/20.
 */
/*jshint esversion: 6 */
import React from "react";
import userMgrAPI from "../../api/userMgrAPI";
import util from "../../common/util";

const getErrorItem = function (row, item) {
    return item.map((itm, idx) => {
        return (
            <div key={"msg_key_col_" + idx}>
                第{row}行的{itm.attr_name}: {util.t(`importErrCode.${itm.error_code}`)}
            </div>
        );
    });
};

let userUtil = {
    handleUploadChange(setImportStatus, info, closeModalFn, setMsgFn) {
        let errorCode = "", status = info.file.status;
        if (info.file.name.indexOf(".csv") > -1) {
            if (info.file.response) {
                errorCode = info.file.response.error;
            }
            if (status === "error") {
                if (errorCode === "1010930") {
                    let dataList = info.file.response.data;
                    let rowList = Object.keys(dataList);
                    let msgObj = rowList.map((row) => {
                        return  <div key={"msg_key_row_" + row}>
                            {getErrorItem(row, dataList[row])}
                        </div>;
                    });
                    setMsgFn("msg", <div>导入的文件中有以下错误:{msgObj}</div>);
                }
                setMsgFn("errorCode", errorCode)
                setImportStatus(info.file.status);
                setTimeout(function () {
                    closeModalFn && closeModalFn();
                }, 100);
            } else if (status === "done") {
                setMsgFn("msg", "导入成功，请进行下一步操作！");
                userMgrAPI.getPreImportResult().then(
                    (response) => {
                        let rs = response.data && response.data.data;
                        if (rs.conflict > 0) {
                            setMsgFn("msg", "共" + rs.total + "条用户信息，存在" + rs.conflict + "名冲突用户。选择全部导入，冲突用户将覆盖原用户信息，请谨慎操作！");
                            setImportStatus("conflict");
                        } else {
                            setMsgFn("msg", "共" + rs.total + "条用户信息，请继续导入用户。");
                            setImportStatus(info.file.status);
                        }
                        closeModalFn && closeModalFn();
                    },
                    () => {
                        setMsgFn("msg", "导入成功，但获取导入结果失败!");
                        setImportStatus(info.file.status);
                        setTimeout(function () {
                            closeModalFn && closeModalFn();
                        }, 100);
                    }
                );
            } else if (status === "uploading") {
                setMsgFn("msg", "导入过程中!");
                setImportStatus(info.file.status);
            } else {
                setMsgFn("msg", "导入出错!");
                setImportStatus(info.file.status);
                setTimeout(function () {
                    closeModalFn && closeModalFn();
                }, 100);
            }
            setMsgFn("isCSV", "true");
        } else {
            setMsgFn("msg", util.t("message.requireCSVFiles"));
            setMsgFn("isCSV", "false");
            setImportStatus("error");
            closeModalFn && closeModalFn();
        }
    },

    /**
     * parse latest login geo string to json obj
     * @param {object[]} geos geo array with json format
     */
    parseLatestLoginGeo(geos) {
        if (geos) {
            return geos.sort((a,b) => b.timestamp - a.timestamp);
        }

        return [];
    },

    sortUserCertByUploadTime(certs) {
        if (certs) {
            return certs.sort((a,b) => b.upload_at - a.upload_at);
        }

        return [];
    },

    /**
     * to check if the user is a system user
     * @param {object} userinfo
     */
    isSystemUser(userinfo) {
        return userinfo && userinfo.created_mode && userinfo.created_mode.toUpperCase() === "BY_SYSTEM";
    },

    renderStatus(status) {
        const map = {
            "ALL": util.t("common.all"),
            "ACTIVE": util.t("common.enabled"),
            "INACTIVE": util.t("common.inactive")
        };
        return map[status && status.toUpperCase()] || "--";
    },

};

export default userUtil;