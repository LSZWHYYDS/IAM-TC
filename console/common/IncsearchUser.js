/**
 * Created by xifeng on 2017/11/16.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Select, Spin } from "antd";
import userMgrAPI from "../api/userMgrAPI";
import defaultAvatar from "../img/default-avatar.png";
import util from "./util";
const Option = Select.Option;

class IncsearchUser extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            data: [],
            fetching: false,
            selections: [],
        };
    }

    clear() {
        //todo? how?
    }

    fetch(value,callback) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.currentValue = value;

        const search = () => {
            const api = userMgrAPI.incsearch(value);
            this.setState({ fetching: true});

            api.then(response => {
                if (this.currentValue === value) {
                    callback(response.data.data);
                }
            },
            () => {
                if (this.currentValue === value) {
                    callback([]);
                }
            });
        };

        this.timeout = setTimeout(search, 300);
    }

    handleSearch(value) {
        this.setState({ value });
        this.fetch(value, data => {
            this.setState({
                fetching: false,
                data: data,
            });
        });
    }

    handleChange(value) {
        this.setState({
            selections: value
        });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    getSelections() {
        return this.state.selections;
    }

    clearSelections() {
        this.setState({
            selections: []
        });
    }

    makeOptions() {
        const { data } = this.state;
        return data.map(this.makeOption.bind(this));
    }

    makeOption(entry) {
        const keyName = this.props.optionKey,
            key = entry[keyName];
        return (
            <Option key={key} title={entry.name || entry.username}>
                <img src={entry.picture || defaultAvatar} style={{verticalAlign:"middle",width: "30px", height: "30px"}} />
                <span style={{display: "inline-block", marginLeft: "10px"}} title={entry.name || entry.username}>
                    { `${entry.name || entry.username}`}
                </span>
            </Option>
        );
    }

    render() {
        const options = this.makeOptions(),
            { fetching} = this.state;
        return (
            <Select
                mode="multiple"
                value={this.state.selections}
                labelInValue
                filterOption={false}
                allowClear={true}
                placeholder={this.props.placeholder}
                notFoundContent={fetching ? <Spin size="large"/> : util.t("common.noMatchFound")}
                onSearch={this.handleSearch.bind(this)}
                onChange={this.handleChange.bind(this)}
                size="large"
                style={this.props.style}
                ref={(input) => {this.userinput= input;}}
            >
                {options}
            </Select>
        );
    }
}

IncsearchUser.defaultProps = {
    placeholder: util.t("app.entitlement.user.searchPlaceholder"),
    style: { width: "100%"},
    optionKey: "sub",
};

export default IncsearchUser;
