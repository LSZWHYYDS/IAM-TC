/**
 * Created by tianyun on 2017/2/4.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";

class TextTimer extends Component {
    constructor(...args) {
        super(...args);
        this.initTime = 30;
        this.state = {
            timer: this.initTime
        };
    }
    componentDidMount() {
        this.start();
    }
    componentWillUnmount() {
        this.clearTimer();
    }
    start() {
        this.setState({timer: this.initTime});
        this.timerHandler = setInterval(() => {
            if (this.state.timer === 1) {
                clearInterval(this.timerHandler);
            }
            this.setState({timer: this.state.timer - 1});
        }, 1000);
    }
    clearTimer() {
        clearInterval(this.timerHandler);
    }
    onClickText() {
        this.props.onClickText();
        this.start();
    }
    render() {
        let textObj;
        if (this.state.timer === 0) {
            textObj = <a href="javascript:void(0);" onClick={this.onClickText.bind(this)} className="forgetPwd-send-email">{this.props.text}</a>;
        } else {
            textObj = <span className="forgetPwd-send-email-gray">{this.props.text}</span>;
        }
        return <span>
            {textObj}
            <span className={this.state.timer === 0 ? "hidden" : "forgetPwd-timer"}>{this.state.timer}s</span>
        </span>;
    }
}

export default TextTimer;
