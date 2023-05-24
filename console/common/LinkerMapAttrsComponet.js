/**
 * Created by chenxi on 2018/3.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Input, Select, Button, Icon } from "antd";
import util from "./util";

const { Option, OptGroup } = Select;
const FormItem = Form.Item;
class LinkerMapAttrsComponent extends Component {
    constructor(...args) {
        super(...args);
        this.basicAttrs = [];
        this.extendAttrs = [];
        this.dataParamName = this.props.dataParamName;
        this.displayNameUtilPrefix = this.props.displayNameUtilPrefix;
        this.state = {
            mappedItemsArray: [...this.props.mappedItems]
        };
    }

    componentWillReceiveProps(nextProps) {
        const mappedItems = nextProps.mappedItems;
        if(mappedItems.size > 0 && this.state.mappedItemsArray.length == 0){
            this.setState({mappedItemsArray: [...mappedItems]});
        }
    }

    add() {
        const newItemArray = this.state.mappedItemsArray;
        let newItem = ["",""];
        newItemArray.push(newItem);
        this.setState({mappedItemsArray: newItemArray});
    }

    remove(k) {
        const newItemArray = this.state.mappedItemsArray;
        newItemArray.splice(k, 1);
        this.setState({mappedItemsArray: newItemArray});
    }

    changeSelectOption (pos, oldVal, newVal) {
        const {getFieldValue, attrValueTips} = this.props;
        const mappedAttrsArray = this.state.mappedItemsArray;
        let dupOpt = mappedAttrsArray.find((ele)=>{
            return ele[0] === newVal;
        });
        if(dupOpt){
            util.showErrorMessage("无法选择重复属性");
        }else{
            let oldEleValue = getFieldValue(`${this.dataParamName}-${oldVal}`);
            let newValTip = "";
            if(attrValueTips) {
                newValTip = attrValueTips[`${newVal}`];
            }
            const newEle = [newVal, oldEleValue || newValTip];
            mappedAttrsArray[pos] = newEle;
            this.setState({mappedItemsArray: mappedAttrsArray});
        }
    }

    render() {
        const { 
            getFieldDecorator,
            basicAttrs,extendAttrs,
            labelSpan, wrapperSpan
        } = this.props;
        const formItemLayout = {
            wrapperCol: {
                span: wrapperSpan,
                offset: labelSpan
            }
        };
        const formItems = [];
        const componentID = this.dataParamName;
        const displayNameUtilPrefix = this.displayNameUtilPrefix;
        if(basicAttrs.length > 0){
            const ItemsMap = new Map(this.state.mappedItemsArray);
            getFieldDecorator(`${componentID}`, {
                initialValue: ItemsMap
            });
            for(let [index, item] of this.state.mappedItemsArray.entries()) {
                formItems.push(
                    <FormItem {...formItemLayout} required={true} key={`${componentID}-${index}`}>
                        {(
                            <Select value={item[0]} onChange = {this.changeSelectOption.bind(this, index, item[0])}
                                style={{ width: "30%"}} allowClear={true} placeholder= "请选择">
                                <OptGroup label={util.t("common.baseParam")}>
                                {
                                    basicAttrs.map(basAttr => {
                                        return (
                                            <Option key={basAttr.domain_name} title={basAttr.display_name} >
                                                <span style={{display: "inline-block"}}> {util.t(`${displayNameUtilPrefix}` + basAttr.domain_name) || basAttr.display_name}</span>
                                            </Option>
                                        );
                                    })
                                }
                                </OptGroup>
                                <OptGroup label={util.t("attr.extendedAttr")}>
                                {
                                    extendAttrs.map(extAttr => {
                                        return (
                                            <Option key={extAttr.domain_name} title={extAttr.display_name} >
                                                <span style={{display: "inline-block"}}> {util.t(`${displayNameUtilPrefix}` + extAttr.domain_name) || extAttr.display_name}</span>
                                            </Option>
                                        );
                                    })
                                }
                                </OptGroup>
                        </Select>
                        )}
                        {(
                            getFieldDecorator(`${componentID}-${item[0]}`,{
                                initialValue: item[1]
                            })
                        )(
                            <Input style={{ width: "30%", marginLeft: "30px", height: "32px" }} />
                        )}
                        {(
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => this.remove(index)}
                                style={{width: "10%"}}
                            />
                        )}
                    </FormItem>
                );
            }
        }else{
            return (
                <Select style={{ width: "100%" }} allowClear={true} placeholder="用户属性"/>
            );
        }
        return (
            <div>
                {formItems}
                <FormItem {...formItemLayout}>
                    <Button type="dashed" onClick={this.add.bind(this)} style={{ width: "70%" }}>
                        <Icon type="plus" />{util.t("common.add")}
                    </Button>
                </FormItem>
            </div>
        );
    }
}
export default LinkerMapAttrsComponent;