/**
 * Created by xifeng on 2018/01/02.
 * The App Role Assignment binding scope org tree.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Tree, Input } from "antd";
import util from "../../common/util";
import orgAPI from "../../api/orgAPI";
import axios from "axios";
import appAPI from "../../api/appAPI";

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class BindingScopeOrgTree extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            data: [],
            expandedKeys: [],
            checkedKeys: {
                checked: [],
                halfChecked: [],
            },
            expandedLevel: this.props.defaultExpandAll ? 100 : 2,
            searchValue: "",
            autoExpandParent: true,
        };
    }
    componentDidMount() {
        this._isMounted = true;
        this.getBindingOrgs();
    }

    getBindingOrgs() {
        const loadOrgTree = orgAPI.getFullOrgTree(),
            loader = axios.all([loadOrgTree]);
        
        loader.then(axios.spread((orgTree) => {
            let root = {
                id: "_root",
                name: util.t("org.org"),
                children: [],
            };
            
            if (orgTree.data && orgTree.data.data) {
                root.children = root.children.concat(orgTree.data.data);
            }
            const expandedList = [], level = 1;
            const getExpandedKeys = (nodeData, level) => {
                if (level < this.state.expandedLevel && nodeData.children.length ) {
                    expandedList.push(nodeData.id);
                    nodeData.children.forEach((subNodeData) => {
                        getExpandedKeys(subNodeData, level + 1);
                    });
                }
            };
            let strData = JSON.stringify(this.props.data)
            let newObjData = JSON.parse(strData)
            if(newObjData.binding_scopes == null){
                newObjData.binding_scopes = []
            }
            const bindingOrgIds = newObjData ? newObjData.binding_scopes.map(
                s => s.scope) : [];
            
            getExpandedKeys(root, level);
            if (this._isMounted) {
                this.setState({
                    data: [root],
                    expandedKeys: expandedList,
                    checkedKeys: { checked: bindingOrgIds, halfChecked: [] },
                });
            }
        })).catch(function (error) {
            util.showErrorMessage(error);
        });
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    renderOrgName(item) {
        return item.id === "_null" ? util.t("org.defaultOrg") : item.name;
    }

    getParentKey(key, tree) {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.id === key)) {
                    parentKey = node.id;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    }

    searchByOrgName(value, tree, matches) {
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i],
                name = this.renderOrgName(node);

            if (name.toLowerCase().indexOf(value.toLowerCase()) >-1 ) {
                matches.push(node);
            }

            if (node.children) {
                this.searchByOrgName(value, node.children, matches);
            }
        }

        return matches;
    }

    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck(checkedKeys) {
        const checked = checkedKeys.checked,
            mods = {
                binding_scopes: checked,
            };
        let api = null;
        let params = null; 
        if (this.props.targetType === "USER"){
            api = appAPI.editBindingScopeForUser;
            params = {
                client_id: this.props.clientId,
                role: this.props.role.name,
                username: this.props.target,
            };
        }else if (this.props.targetType === "TAG"){
            api = appAPI.editBindingScopeForTag;
            params = {
                client_id: this.props.clientId,
                role: this.props.role.name,
                tag_name: this.props.target,
            };
        }

        api(params, mods).then(() => {
            util.showSuccessMessage();
            this.setState({ checkedKeys: {checked: checked, halfChecked: checkedKeys.halfChecked} });
        }, error => {
            util.showErrorMessage(error);
        });
    }

    getSelections() {
        return this.state.checkedKeys ? this.state.checkedKeys.checked : [];
    }

    onChange(evt) {
        const value = evt.target.value,
            dataList = this.state.data;

        let matches = [];
        this.searchByOrgName(value, dataList, matches);

        const expandedKeys = matches.map((item) => {
            return this.getParentKey(item.id, dataList);
        });

        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }

    render() {
        const { searchValue, expandedKeys, checkedKeys, autoExpandParent } = this.state;
        const loop = data => data.map((item) => {
            const name = this.renderOrgName(item),
                index = name.toLowerCase().indexOf(searchValue.toLowerCase()),
                beforeStr = name.substr(0, index),
                matchStr = name.substr(index, searchValue.length),
                afterStr = name.substr(index + searchValue.length),

                disableCheckbox = (item.id === "_root"),
                selectable = false;
            const title = index > -1 ? (
                <span>
                    {beforeStr}
                    <span style={{ color: "#f50" }}>{matchStr}</span>
                    {afterStr}
                </span>
                ) : <span>{name}</span>;

            if (item.children && item.children.length>0) {
                return (
                    <TreeNode key={item.id} title={title} disableCheckbox={disableCheckbox} selectable={selectable}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={title} disableCheckbox={disableCheckbox} selectable={selectable} />;
        });

        return (
            <div className="scrollable-div">
                <div style={{ width: "30%" }}>
                    <Search
                        size="large"
                        placeholder={util.t("app.perm.binding.org.searchPlaceholder")}
                        onChange={this.onChange.bind(this)}
                    />
                </div>

                <div>
                    <Tree
                        checkable
                        checkStrictly
                        showLine
                        expandedKeys={expandedKeys.concat(checkedKeys.checked)}
                        checkedKeys={checkedKeys}
                        onExpand={this.onExpand.bind(this)}
                        onCheck={this.onCheck.bind(this)}
                        autoExpandParent={autoExpandParent}
                    >
                        {loop(this.state.data)}
                    </Tree>
                </div>
            </div>
        );
    }
}

export default BindingScopeOrgTree;