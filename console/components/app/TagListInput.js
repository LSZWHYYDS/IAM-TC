/**
 * Created by xifeng on 2017/11/20.
 * The App entitlement user list.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import tagAPI from "../../api/tagAPI";
import util from "../../common/util";
import { Select, } from "antd";
const Option = Select.Option;

class TagListInput extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            _tagListLoaded: false,
            tagList : null,
            selections : this.props.selections || []
        };
        this.params = this.props.params;
    }

    componentDidMount(){
        const tagList =  tagAPI.getTagList(this.params);

        tagList.then(response => {
            this.setState({_tagListLoaded : true, tagList: response.data.data});
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

    render() {
        const filterFactor= function(inputValue, option){
            const title = option.props.title;
            const m1 = (title && title.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);
            return m1;
        };

        return (
            this.state._tagListLoaded && this.state.tagList && this.state.tagList.length > 0 ?
                <Select mode="multiple" style={{ width: "100%" }} filterOption={filterFactor} allowClear={true} placeholder={util.t("app.tagListDropDown")}
                  onChange={this.handleChange.bind(this)} value={this.state.selections}
                >
                    {
                        this.state.tagList.map(tag => {
                            return (
                                <Option key={tag.name} title={tag.name} >
                                    <span style={{display: "inline-block"}}> {tag.name}</span>
                                </Option>
                            );
                        })
                    }
                </Select>
            : <Select mode="multiple" style={{ width: "100%" }}  allowClear={true} placeholder={util.t("app.tagListDropDown")}/>
        );
    }
}

export default TagListInput;
