/**
 * Created by tianyun on 2017/1/22.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";

class AnimateArea extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            status: 2
        };
        this.classMap = ["col-right-container", "col-right-container tree-wid", "col-right-container tree-show", "col-right-container tree-hide"];
    }
    onClickBtn() {
        let status = (this.state.status + 1) % 4;
        this.setState({status: status});
        if (status === 1 || status === 3) {
            setTimeout(()=>{
                this.onClickBtn();
            }, 300);
        }
    }
    render() {
        return (
            <div className={this.classMap[this.state.status]}>
                <button className={this.state.status !== 0 ? "icon iconfont icon-close closeStyle" : "icon iconfont icon-treestructure treestructureStyle"} onClick={this.onClickBtn.bind(this)}></button>
                <div className="col-right-content-outer">
                    <div className="col-right-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default AnimateArea;