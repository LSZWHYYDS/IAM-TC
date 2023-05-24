/*jshint esversion: 6 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {  Button } from "antd";
import util from "../../common/util";
import PagerTable from "../../common/pagerTable";
import appAPI from "../../api/appAPI";
import RoleBindingScopeDialog from "./RoleBindingScopeDialog";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";

class RoleBindingTagList extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            editScope: false,
            editingEntry: null,
        };
    }

    onRenderName(text, entry) {
        const name = (
            <span style={{display: "inline-block", marginLeft: "10px"}} title={entry.tag_name}>
                {entry.tag_name}
            </span>
        );
        return (
            <AuthzComponent
                allowed={[PERM_SETS.VIEW_TAG, PERM_SETS.DELETE_TAG, PERM_SETS.EDIT_TAG]}
                defaultComponent={name}
            >
                <Link className="detail-link" to={"/home/editTag/" + entry.tag_name}>
                    {name}
                </Link>
            </AuthzComponent>
        );
    }

    onRenderScopes(text, entry) {
        return (
            entry.binding_scopes && entry.binding_scopes.length > 0 &&
                <div>
                    { entry.binding_scopes.map(this.renderOneScope.bind(this)) }
                </div>
        );
    }
    renderOneScope(scope) {
        return (
            scope &&
                <div key={scope.scope} title={scope.scope}>
                    {
                        scope.scope === "_null" ? util.t("org.defaultOrg")
                        : scope.scope_description || scope.scope
                    }
                </div>
        );
    }

    onRenderActions(text, entry ) {
        return (
            <div>
                {
                    this.props.hasScope &&
                    <Button icon="edit" shape="circle" title={util.t("app.perm.binding.scope.title")} size="large" onClick={this.editScope.bind(this, entry)} />
                }
                <Button icon="delete" shape="circle" title={util.t("common.delete")} size="large" onClick={this.unboundTag.bind(this, entry)} />
            </div>
        );
    }

    refreshTable() {
        this.userTable.refresh({} , false);
    }
    initTable() {
        const cols = [{
            title: util.t("tag.name"),
            dataIndex: "tag_name",
            key: "tag_name",
            render: this.onRenderName.bind(this)
        }];

        if (this.props.hasScope) {
            cols.push({
                title: util.t("app.entitlement.user.tbl.cols.scope"),
                dataIndex: "binding_scopes",
                key: "binding_scopes",
                render: this.onRenderScopes.bind(this),
            });
        }

        cols.push({
            title: util.t("app.entitlement.user.tbl.cols.action"),
            key: "actions",
            dataIndex: "tag_name",
            render: this.onRenderActions.bind(this),
        });

        return cols;
    }
    componentDidMount() {
        util.filterDangerousChars();
    }
    editScope(entry) {
        this.setState({
            editScope: true,
            editingEntry: entry,
        });
    }

    cancelEditScope() {
        this.setState({
            editScope: false,
            editingEntry: null,
        });
        this.refreshTable();
    }
    unboundTag(entry) {
        const params = {
            client_id: this.props.clientId,
            role: this.props.role.name,
            tag_name: [ entry.tag_name ],
        };

        appAPI.unbindTagWithRole(params).then(
            () => {
                util.showSuccessMessage();
                this.refreshTable();
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }

    render() {
        const params = {
                client_id: this.props.clientId,
                role_name: this.props.role.name,
            }, { editingEntry } = this.state;
        return (
            <div>
                <div className="row-container">
                    <div className="col-left-container">
                        <div>
                            <PagerTable
                                {...this.props}
                                rowKey="tag_name"
                                pageSize={100}
                                api={appAPI.getRoleBindingTags}
                                containerClassName="app-entitled-user-table"
                                params={params}
                                columns={this.initTable()}
                                showSelect={false}
                                ref={(input) => {this.userTable = input;}}
                            />
                        </div>
                        <div>
                            <RoleBindingScopeDialog
                                show={this.state.editScope}
                                clientId={this.props.clientId}
                                role={this.props.role}
                                data={editingEntry}
                                target={editingEntry? editingEntry.tag_name: editingEntry}
                                targetType={"TAG"}
                                onClose={this.cancelEditScope.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
RoleBindingTagList.defaultProps = {
    hasScope : true, //can has scope
};
export default RoleBindingTagList;
