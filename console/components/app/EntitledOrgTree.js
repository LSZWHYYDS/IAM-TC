/**
 * Created by xifeng on 2017/11/24.
 * The App entitlement org tree.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Tree, Input } from "antd";
import util from "../../common/util";
import appAPI from "../../api/appAPI";

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class EntitledOrgTree extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            data: [],
            expandedKeys: [],
            entitledOrgKeys: {
                checked: [],
                halfChecked: [],
            },//entitled org ids, which will always be expanded
            expandedLevel: this.props.defaultExpandAll ? 100 : 2,
            searchValue: "",
            autoExpandParent: true,
        };
        this.id = this.props.appId;
    }
    componentDidMount() {
        this._isMounted = true;
        this.getEntitledOrgTree();
    }
    getEntitledOrgTree() {
        appAPI.getEntitledOrgTree(this.id).then(
            (response) => {
                const expandedList = [], entitledOrgList = [], level = 1;
                const getExpandedKeys = (nodeData, level) => {
                    if (level < this.state.expandedLevel && nodeData.children.length ) {
                        expandedList.push(nodeData.id);
                        nodeData.children.forEach((subNodeData) => {
                            getExpandedKeys(subNodeData, level + 1);
                        });
                    }
                };

                const getEntitledOrgList = (nodeData) => {
                    if (nodeData.entitled) {
                        entitledOrgList.push(nodeData.id);
                    }
                    nodeData.children.forEach((subNodeData) => {
                        getEntitledOrgList(subNodeData);
                    });
                };

                let root = {
                    id: "_root",
                    name: util.t("org.org"),
                    children: []
                };

                if (response.data && response.data.data && response.data.data.length > 0){
                    root.children = root.children.concat(response.data.data);
                }

                getEntitledOrgList(root);
                getExpandedKeys(root, level);
                if (this._isMounted) {
                    this.setState({
                        data: [root],
                        expandedKeys: expandedList,
                        entitledOrgKeys: { checked: entitledOrgList, halfChecked: [] },
                        //entitledOrgKeys: entitledOrgList,
                    });
                }
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
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

    onCheck(checkedKeys, e) {
        const olds = this.state.entitledOrgKeys.checked,
            news = checkedKeys.checked,
            diff = olds.filter(k => news.indexOf(k) == -1)
                        .concat(news.filter(k => olds.indexOf(k) == -1)),
            params = {
                id: this.id,
                org_id: diff.join(""),
            };

        let api = appAPI.addOrgEntitlement;
        if (e.checked) { //entitlement added
            api = appAPI.addOrgEntitlement;
        } else { // entitlement removed
            api = appAPI.removeOrgEntitlement;
        }

        api(params).then(() => {
            util.showSuccessMessage();
            this.setState({ entitledOrgKeys: {checked: news, halfChecked: checkedKeys.halfChecked} });
        }, error => {
            util.showErrorMessage(error);
        });
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
        const { searchValue, expandedKeys, entitledOrgKeys, autoExpandParent } = this.state;

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
                <div style={{ width: "30%"}}>
                    <Search
                        size="large"
                        placeholder={util.t("app.entitlement.group.searchPlaceholder")}
                        onChange={this.onChange.bind(this)}
                    />
                </div>
                <div>
                    <Tree
                        checkable
                        checkStrictly
                        showLine
                        expandedKeys={expandedKeys.concat(entitledOrgKeys.checked)}
                        checkedKeys={entitledOrgKeys}
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

export default EntitledOrgTree;