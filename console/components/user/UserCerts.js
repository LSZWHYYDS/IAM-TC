/**
 * Created by xifeng on 2018/01/26.
 * user certifications
 */
/*jshint esversion: 6 */

import React, { Component } from "react";
import { Modal, Button, Table, Tooltip } from "antd";
import util from "../../common/util";
import userUtil from "./userUtil";
import userMgrAPI from "../../api/userMgrAPI";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { PERM_SETS } from "../../constants";
import { authorized } from "../../common/authorization";
import moment from "moment";

moment.locale("zh-cn");

class UserCerts extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            data: [], // cert lists.
            deleting: false,// deleting cert?
            deletingCert: null,// to-be-deleted cert record.
        };
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        this.refresh();
    }
    refresh(){
        const authorizedManageUser = authorized([
            PERM_SETS.VIEW_USER,
            PERM_SETS.DELETE_USER,
            PERM_SETS.EDIT_USER,
            PERM_SETS.EDIT_USER_PWD,
            PERM_SETS.EXPORT_USER,
            PERM_SETS.IMPORT_USER,
            PERM_SETS.NEW_USER,
        ], this.props.userPermSets);

        let api = userMgrAPI.getSelfCerts;
        const username = this.props.id;
        if (this.props.id === this.props.whoami) { //self
            api = userMgrAPI.getSelfCerts;
        } else if (this.props.isAdminView && authorizedManageUser) {
            api = userMgrAPI.adminGetUserCerts; // admin get user certs.
        } else {
            api = userMgrAPI.getSelfCerts;
        }

        api(username).then(response => {
            if (this._isMounted && response.data && response.data.data) {
                this.setState({data: response.data.data.items});
            }
        });
    }
    columns() {
        return [
            {
                key: "device_id",
                title: util.t("user.usercerts.cols.device_id"),
                dataIndex: "device_id",
            }, {
                key: "device_model",
                title: util.t("user.usercerts.cols.device_model"),
                dataIndex: "device_model",
            }, {
                key: "uploaded_at",
                title: util.t("user.usercerts.cols.upload_at"),
                dataIndex: "uploaded_at",
                render: (text,record) => util.formatUnixTimestamp(record.uploaded_at),
            }, {
                key: "expire_at",
                title: util.t("user.usercerts.cols.expire_at"),
                dataIndex: "expire_at",
                render: (text,record) => this.renderExpiration(record.expire_at),
            }, {
                key: "recently_used_at",
                title: util.t("user.usercerts.cols.recently_used_at"),
                dataIndex: "recently_used_at",
                render: (text,record) => record.recently_used_at === 0 ? util.t("user.usercerts.text.never_used")
                                        : util.formatUnixTimestamp(record.recently_used_at),
            }, {
                key: "kty",
                title: util.t("user.usercerts.cols.kty"),
                dataIndex: "kty",
            }, {
                key: "alg",
                title: util.t("user.usercerts.cols.alg"),
                dataIndex: "alg",
            }, {
                key: "status",
                title: util.t("user.usercerts.cols.status"),
                dataIndex: "status",
                render: (text,record) => userUtil.renderStatus(record.status),
            }, {
                key: "id",
                title: util.t("user.usercerts.cols.action"),
                dataIndex: "id", 
                render: (text,record) => this.renderAction(text,record),
            },
        ];
    }
    renderExpiration(expireAt) {
        const { cls, note, title } = this.expirationStatus(expireAt);

        return (
            <Tooltip title={title}>
                <span className={cls}>{note}</span>
            </Tooltip>
        );
    }
    renderAction(text,record) {
        const enableBtn = (
            <Button icon="play-circle-o" shape="circle" title={util.t("common.enable")} size="large"
                onClick={this.toggleStatus.bind(this, record)}
            />
        ), disableBtn = (
            <Button icon="minus-circle-o" shape="circle" title={util.t("common.disable")} size="large"
                title={util.t("common.disable")}
                onClick={this.toggleStatus.bind(this, record)}
            />
        );

        return (
            <div>
                {record.status === "ACTIVE" ? disableBtn : enableBtn}
                <Button icon="delete" shape="circle" title={util.t("common.delete")} size="large"
                    onClick={this.tryToDelete.bind(this, record)}
                />
            </div>
        );
    }
    sort(data) {
        return userUtil.sortUserCertByUploadTime(data);
    }
    expirationStatus(expiration) {
        if (expiration <=0 ) { // never expired.
            return {
                cls: "cert-valid",
                status: "valid",
                note: util.t("common.neverExpired"),
                title: util.t("common.neverExpired"),
            };
        }

        const now= moment(),
            exp = moment.unix(expiration);
        if (exp.isBefore(now)) { //expired
            return {
                cls: "cert-expired",
                status: "expired",
                note: `${exp.fromNow()}${util.t("common.expired")}`,
                title: util.formatUnixTimestamp(expiration),
            };
        }else if (exp.diff(now,"days") <= 7 ) { //expiring in 7 days
            return {
                cls: "cert-expiring",
                status: "expiring",
                note: `${exp.fromNow()}${util.t("common.expiring")}`,
                title: util.formatUnixTimestamp(expiration),
            };
        }else {
            return {
                cls: "cert-valid",
                status: "valid",
                note: util.formatUnixTimestamp(expiration),
                title: util.formatUnixTimestamp(expiration),
            };
        }
    }
    toggleStatus(record){
        const authorizedManageUser = authorized([
            PERM_SETS.VIEW_USER,
            PERM_SETS.DELETE_USER,
            PERM_SETS.EDIT_USER,
            PERM_SETS.EDIT_USER_PWD,
            PERM_SETS.EXPORT_USER,
            PERM_SETS.IMPORT_USER,
            PERM_SETS.NEW_USER,
        ], this.props.userPermSets);

        let api = userMgrAPI.selfToggleCertStatus;
        const username = this.props.id, certid = record.id,
            status = util.toggleStatus(record.status);
        if (this.props.id === this.props.whoami) { //self
            api = userMgrAPI.selfToggleCertStatus;
        } else if (this.props.isAdminView && authorizedManageUser) {
            api = userMgrAPI.adminToggleCertStatus; // admin toggle user certs.
        } else {
            api = userMgrAPI.selfToggleCertStatus;
        }

        api(certid, status, username).then(() => {
            util.showSuccessMessage();
            this.refresh();
        }, (error) => {
            util.showErrorMessage(error);
        });
    }
    tryToDelete(record) {
        this.setState({
            deleting: true,
            deletingCert: record,
        });
    }
    cancelDelete(){
        this.setState({
            deleting: false,
            deletingCert: null,
        });
    }
    delete() {
        const { deletingCert } = this.state;
        if (!deletingCert && !deletingCert.id) {
            return;
        }
        const authorizedManageUser = authorized([
            PERM_SETS.VIEW_USER,
            PERM_SETS.DELETE_USER,
            PERM_SETS.EDIT_USER,
            PERM_SETS.EDIT_USER_PWD,
            PERM_SETS.EXPORT_USER,
            PERM_SETS.IMPORT_USER,
            PERM_SETS.NEW_USER,
        ], this.props.userPermSets);

        let api = userMgrAPI.selfDeleteCert;
        const username = this.props.id, certid = deletingCert.id;
        if (this.props.id === this.props.whoami) { //self
            api = userMgrAPI.selfDeleteCert;
        } else if (this.props.isAdminView && authorizedManageUser) {
            api = userMgrAPI.adminDeleteCert; // admin delete user certs.
        } else {
            api = userMgrAPI.selfDeleteCert;
        }

        api(certid, username).then(() => {
            util.showSuccessMessage();
            this.refresh();
        }, (error) => {
            util.showErrorMessage(error);
        });
        this.cancelDelete();
    }
    render() {
        return (
            <div>
                <Table
                    columns={this.columns()}
                    dataSource={this.sort(this.state.data)}
                    rowKey={record => record.id}
                />
                <Modal title={util.t("common.delPrompt")}
                    closable={false}
                    visible={this.state.deleting}
                    footer={[
                        <Button key="cancel" size="large" onClick={this.cancelDelete.bind(this)}>{util.t("common.cancel")}</Button>,
                        <Button key="del" size="large" type="primary" onClick={this.delete.bind(this)}>{util.t("common.ok")}</Button>
                    ]}
                >
                    <div style={{lineHeight: "60px"}}>
                        <p style={{height: "60px", fontSize: "14px"}}>{util.t("user.usercerts.prompt.delete")}</p>
                    </div>
                </Modal>
            </div>
        );
    }
}

UserCerts.defaultProps = {
    /**
     * mock data
    data: [{
        device_model: "HuaWei Mate 9",
        upload_at: 1516931009,
        expire_at: 1516951009,
        recently_used_at: 1516951009,
        alg: "RSA256",
        status: "ACTIVE",
        id: "k1",
    }, {
        device_model: "IPhone X",
        upload_at: 1516755528,
        expire_at: 1516999994,
        recently_used_at: 1516951009,
        alg: "RSA128",
        status: "INACTIVE",
        id: "k2",
    }, {
        device_model: "XiaoMi",
        upload_at: 1516755528,
        expire_at: 0,
        recently_used_at: 1516951009,
        alg: "RSA128",
        status: "INACTIVE",
        id: "k3",
    }, {
        device_model: "ChuiZi",
        upload_at: 1316755528,
        expire_at: 1816755528,
        recently_used_at: 1516951009,
        alg: "RSA128",
        status: "ACTIVE",
        id: "k4",
    }],
    */
};

const whoami = createSelector(state => state.login.whoami, (whoami) => whoami);
const isAdminView = createSelector(state => state.view.adminView, (adminView) => adminView);
const userPermSets = createSelector(state => state.login.userPermSets, (userPermSets) => userPermSets);

const mapStateToProps = (state) => ({
    isAdminView: isAdminView(state),
    whoami: whoami(state),
    userPermSets: userPermSets(state),
});

export default connect(mapStateToProps)(UserCerts);