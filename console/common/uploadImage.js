/**
 * Created by tianyun on 2017/1/6.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Icon, Upload, message, Button } from "antd";
import util from "./util";

const props = {
    name: "file",
    action: "/upload.do",
    headers: {
        authorization: "authorization-text",
    },
    onChange(info) {
        if (info.file.status !== "uploading") {
            //console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
            message.success("${info.file.name} file uploaded successfully");
        } else if (info.file.status === "error") {
            message.error("${info.file.name} file upload failed.");
        }
    }
};

class UploadImage extends Component {
    constructor(...args) {
        super(...args);
    }
    render() {
        return (
            <Upload {...props}>
                <Button type="ghost">
                    <Icon type="upload" /> {util.t("common.upload")}
                </Button>
            </Upload>
        );
    }
}

export default UploadImage;
