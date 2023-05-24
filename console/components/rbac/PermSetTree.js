/**
 * Created by xifeng on 2018/01/09.
 * The Permission Set Tree which is grouped by tag.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Tree } from "antd";
import util from "../../common/util";
import appAPI from "../../api/appAPI";

const TreeNode = Tree.TreeNode;

class PermSetTree extends Component {
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
            autoExpandParent: true,
        };

        this.clientId = "tc";
    }
    componentDidMount() {
        this._isMounted = true;
        this.fetch();
    }

    groupby(arr, key) {
        return arr.reduce(function(acc, item){
            const kv = item[key];
            if (Array.isArray(kv)) {
                kv.forEach(function(v) {
                    acc[v] = acc[v] || [];
                    acc[v].push(item);
                });
            }
            return acc;
        }, {});
    }

    sortpermset(permset) {
        permset.sort(function(a,b) {
            const aa = a.name.toUpperCase(),
                bb = b.name.toUpperCase();

            if (aa.startsWith("VIEW_")) {
                return bb.startsWith("VIEW_") ? aa.localeCompare(bb) : -1;
            }

            if (bb.startsWith("VIEW_")) {
                return aa.startsWith("VIEW_") ? aa.localeCompare(bb) : 1;
            }

            return aa.localeCompare(bb);
        });
    }

    /**
     * convert to a group (by tag) of permsets to tree
     * @param {string} tag
     * @param {object[]} permsets
     */
    permsetsToTree(tag, permsets) {
        const root = {
            id: tag,
            name: this.tagI18nText(tag),
            children: permsets.map(pm => this.permsetToChildren(pm)),
        };

        return root;
    }

    accountingPermSetsTree(accounting) {
        const children = [
                this.permsetsToTree("USER", accounting.USER)
            ], rootTag = "ACCOUNTING";

        //hack for SUPER_ADMIN,
        if (this.props.bindings && this.props.bindings.includes("NEW_ORG")) {
            children.push(this.permsetsToTree("ORG", accounting.ORG));
        }
        children.push(this.permsetsToTree("EXT_ATTR", accounting.EXT_ATTR));
        children.push(this.permsetsToTree("DATASOURCE", accounting.DATASOURCE));
        children.push(this.permsetsToTree("TAG", accounting.TAG));
        // children.push(this.permsetsToTree("PROFILE", accounting.PROFILE));

        return {
            id: rootTag,
            name: this.tagI18nText(rootTag),
            children: children,
        };
    }
    appPermSetsTree(app) {
        const children = [
                this.permsetsToTree("APP", app.APP),
                this.permsetsToTree("ROLE", app.ROLE),
            ], rootTag = "APPLICATION";

        return {
            id: rootTag,
            name: this.tagI18nText(rootTag),
            children: children,
        };
    }

    tagI18nText(tag) {
        const key = "rbac.permsetTree.tags." + tag.toLowerCase();
        return util.t(key);
    }

    permsetToChildren(permset) {
        return {
            id: permset.name,
            name: permset.display_name,
            children: []
        };
    }

    fetch() {
        const api = appAPI.getPermSet,
            params = {
                client_id: this.clientId,
                page: 1,
                size: 100,
            };

        api(params).then(
            (response) => {
                const data = response.data.data.items;
                //group by tag
                const grouped = this.groupby(data, "tags");
                //sort by name
                Object.keys(grouped).forEach(key => {
                    this.sortpermset(grouped[key]);
                });
                //further group accounting
                grouped.ACCOUNTING = {
                    USER: grouped.USER,
                    ORG: grouped.ORG,
                    EXT_ATTR: grouped.EXT_ATTR,
                    DATASOURCE: grouped.DATASOURCE,
                    TAG: grouped.TAG,
                    // PROFILE: grouped.PROFILE,
                };
                delete grouped.USER;
                delete grouped.ORG;
                delete grouped.EXT_ATTR;
                delete grouped.DATASOURCE;
                delete grouped.PROFILE;
                delete grouped.TAG;
                //further group app
                grouped.APPLICATION = {
                    APP: grouped.APP,
                    ROLE: grouped.ROLE,
                };
                delete grouped.ROLE;
                delete grouped.APP;

                const trees = {};
                for (const group in grouped) {
                    if (group.toUpperCase() === "ACCOUNTING") {
                        trees[group] = this.accountingPermSetsTree(grouped[group]);
                    } else if (group.toUpperCase() === "APPLICATION") {
                        trees[group] = this.appPermSetsTree(grouped[group]);
                    } else {
                        trees[group] = this.permsetsToTree(group, grouped[group]);
                    }
                }

                if (this._isMounted) {
                    this.setState({
                        data: [trees.ACCOUNTING, trees.APPLICATION, trees.AUDIT, trees.SETTINGS],
                        bindings: this.props.bindings,
                    });
                }
            }
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
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

    onCheck(checkedKeys, e) {
        this.setState({
            bindings: checkedKeys,
        });

        if (this.props.onCheck) {
            //filter out only perm set nodes, ignore tag nodes.
            const checkedPermSets = e.checkedNodes.filter(node => node.props.isLeaf).map(node => node.key);
            this.props.onCheck(checkedPermSets);
        }
    }

    render() {
        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode key={item.id} title={item.name} selectable={false} isLeaf={false} disabled={this.props.readonly}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={item.name} selectable={false} isLeaf={true} disabled={this.props.readonly}/>;
        });
        const {bindings} = this.state;

        return (
            <div className="scrollable-div" >
                <Tree
                    checkable
                    onCheck={this.onCheck.bind(this)}
                    checkedKeys={bindings}
                    defaultExpandedKeys={["ACCOUNTING","APPLICATION"]}
                >
                    {loop(this.state.data)}
                </Tree>
            </div>
        );
    }
}

export default PermSetTree;