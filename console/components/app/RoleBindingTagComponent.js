/**
 * Created by xifeng on 2018/01/05.
 * edit or create app Role bindings user component
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Button, Row, Col } from "antd";
import util from "../../common/util";
import TagListInput from "./TagListInput";
import RoleBindingTagList from "./RoleBindingTagList";

import appAPI from "../../api/appAPI";

class RoleBindingTagComponent extends Component {
    constructor(...args) {
        super(...args);
        this.clientId = this.props.clientId;
        this.role = this.props.role;
        this.state = {
            new_tag_selected: false,
        };
    }

    componentDidMount() {
        util.filterDangerousChars();
        this.setState({
        });
    }
    //on new user selected
    onNewTagSelected(value) {
        this.setState({
            new_tag_selected: value,
        });
    }
    //bind tag
    bindTag() {
        const selections = this.tagListInput.getSelections(),
            tags = selections ? selections : [],
            params = {
                client_id: this.clientId,
                role: this.props.role.name,
            }, payload = {
                binding_scopes: [],
                targets: tags,
            };
        appAPI.bindTagWithRole(params, payload).then(() => {
            util.showSuccessMessage();

            //clear user selections
            this.tagListInput.clearSelections();
            this.setState({
                new_tag_selected: false,
            });
            this.bindingTagList.refreshTable();
        });
    }
    render() {
        const {new_tag_selected} = this.state;
        return (
            <div className="scrollable-div">
                <Row>
                    <Col span={22}>
                        <TagListInput
                            optionKey="tagListInput"
                            onChange={this.onNewTagSelected.bind(this)}
                            ref={(input) => { this.tagListInput = input; }}
                        />
                    </Col>
                    <Col span={1}>
                        <Button icon="user-add" size="large" disabled={!new_tag_selected || new_tag_selected.length===0} onClick={this.bindTag.bind(this)} shape="circle"/>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <RoleBindingTagList
                            ref={(input) => {this.bindingTagList=input;}}
                            clientId={this.clientId}
                            role={this.props.role}
                            hasScope={this.props.hasScope}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
RoleBindingTagComponent.defaultProps = {
    hasScope : true, //can has scope
};
export default RoleBindingTagComponent;