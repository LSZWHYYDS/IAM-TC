/**
 * Created by tianyun on 2017/1/20.
 */
/*jshint esversion: 6 */

import React, { Component } from "react";
import Modal from "react-modal";
import util from "./util";

const isLandscape = util.isLandscape();

class ModalDialog extends Component {
    constructor(...args) {
        super(...args);
        this.modalStyles = {
            overlay: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
                textAlign: "center"
            },
            content: {
                border: "1px solid #ccc",
                background: "#fff",
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                borderRadius: "5px",
                outline: "none",
                padding: "20px",
                width: isLandscape ? "600px" : "300px",
                height: "auto",
                position: "absolute",
                top: "50%",
                left: "50%",
                bottom: "auto",
                //marginLeft: isLandscape ? "-250px" : "-150px",
                //marginTop: "-130px",
                transform: "translate(-50%, -50%)"
            }
        };
    }
    render() {
        if (this.props.width) {
            this.modalStyles.content.width = this.props.width;
        }
        if (this.props.height) {
            this.modalStyles.content.height = this.props.height;
        }
        if (this.props.hidden) {
            this.modalStyles.overlay.display = "none";
        } else {
            this.modalStyles.overlay.display = "block";
        }
        return (
            <Modal isOpen={this.props.show}
                style={this.modalStyles}
                contentLabel=""
            >
                <div className="modal-title">
                    {this.props.title || util.t("common.prompt")}
                </div>
                {this.props.children}
            </Modal>
        );
    }
}

export default ModalDialog;
