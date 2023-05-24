/**
 * Created by tianyun on 2016/12/26.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Tree } from "antd";
import util from "./util";
import orgAPI from "../api/orgAPI";

const TreeNode = Tree.TreeNode;

class UserGroupTree extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            data: [],
            expandedKeys: [],
            expandedLevel: this.props.defaultExpandAll ? 100 : 2,
            selectedKey: null,
            selectedNode: null,
            keyword: "",
            autoExpandParent: true,
        };
    }
    componentDidMount() {
        this._isMounted = true;
        this.getOrgTree();
    }
    getOrgTree() {
        orgAPI.getOrgTree().then(
            (response) => {
                let expandedList = [], level = 1;
                
                const getExpandedKeys = (nodeData, level) => {
                    if (level < this.state.expandedLevel && nodeData.children ) {
                        expandedList.push(nodeData.id);
                        nodeData.children.forEach((subNodeData) => {
                            getExpandedKeys(subNodeData, level + 1);
                        });
                    }
                };
                let root = {
                    id: "_root",
                    name: util.t("org.org"),
                    children: []
                };
                if (response.data && response.data.data && response.data.data.length > 0){
                    root.children = root.children.concat(response.data.data);
                }
                getExpandedKeys(root, level);
                if (this._isMounted) {
                    this.setState({
                        data: [root],
                        expandedKeys: expandedList
                    });
                }
                this.onClickTreeNode([this.props.defaultSelectedKey || "_root"]);
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onClickTreeNode(selectedKeys, e) {
        this.setState({
            selectedKey: selectedKeys[0],
            selectedNode: e ? e.node : null
        });
        this.props.onClickTreeNode(selectedKeys[0], e);
    }
    onSearch(keyword){
        let matches = [];
        const data = this.state.data;

        this.searchByOrgName(keyword, data , matches);
        const expandedKeys = matches.map((item) => {
            return this.getParentKey(item.id, data);
        });

        this.setState({
            expandedKeys,
            keyword,
            autoExpandParent:true,
        });
    }

    renderOrgName(item) {
        return item.id === "_null" ? util.t("org.defaultOrg") : item.name;
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
    render() {
        const { keyword, autoExpandParent } = this.state;
        const loop = data => data.map((item) => {
            const name = this.renderOrgName(item),
                index = name.toLowerCase().indexOf(keyword.toLowerCase()),
                beforeStr = name.substr(0, index),
                matchStr = name.substr(index, keyword.length),
                afterStr = name.substr(index + keyword.length),
                title = index > -1 ? (
                    <span>
                        {beforeStr}
                        <span style={{ color: "#f50" }}>{matchStr}</span>
                        {afterStr}
                    </span>
                ) : <span>{name}</span>;

            if (item.children && item.children.length && this.props.hideKey || this.props.hideReadonly) {
                item.children = item.children.filter(itm => {
                    return itm.id !== this.props.hideKey && !(this.props.hideReadonly && itm.readonly);
                });
            }
            let disabled = this.props.disabledKeys ? ("," + this.props.disabledKeys + ",").indexOf("," + item.id + ",") > -1 : false;
            if (item.children && item.children.length) {
                return (
                    <TreeNode key={item.id} disabled={disabled} rawtitle={name} title={title}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} disabled={disabled} rawtitle={name} title={title} />;
        });

        return (
            <div>
                <Tree
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={autoExpandParent}
                    selectedKeys={[this.props.selectedKey]}
                    showLine
                    defaultSelectedKeys={[this.props.defaultSelectedKey || "_root"]}
                    onSelect={this.onClickTreeNode.bind(this)}
                    onExpand={this.onExpand.bind(this)}
                >
                    {loop(this.state.data)}
                </Tree>
            </div>
        );
    }
}

export default UserGroupTree;