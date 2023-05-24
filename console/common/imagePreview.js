/**
 * Created by tianyun on 2017/1/6.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Row, Col} from "antd";
import util from "./util";

class ImagePreview extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            image: this.props.src
        };
        this.fileSize = 0;
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.src !== nextProps.src) {
            this.setState({
                image: nextProps.src
            });
        }
    }
    readAsDataURL() {
        //检验是否为图像文件
        let file = document.getElementById("file").files[0];
        if (file) {
            if (!/image\/\w+/.test(file.type) || !this.props.type.includes(file.type.split("\/")[1])) {
                util.showErrorMessage(util.t("message.imgTypeErr"));
                return;
            }
            this.fileSize = parseInt((file.size) / 1024); //计算图片大小，默认是B，转换成KB
            if (this.fileSize > this.props.maxSize) {
                util.showErrorMessage(util.t("message.imgSize"));
                return;
            }
            var reader = new FileReader();
            //将文件以Data URL形式读入页面
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (this.props.ImgHWSize) {
                    const {limitWidth, limitHeight} = this.props.ImgHWSize, that = this;
                    let image = new Image();
                    image.onload = function () {
                        const height = this.height, width = this.width;
                        if((height === limitWidth) && (width === limitHeight)) {
                            that.setState({image: reader.result});
                        } else {
                            util.showErrorMessage(util.t("message.imgHWSize"));
                        }
                    };
                    image.src = reader.result;
                } else {
                    this.setState({image: reader.result});
                }
            };
        }
    }
    render() {
        return (<div className="img-pre">
                    <Row>
                        <Col span="24" >
                            <img src={this.state.image} className="pre-box"/>
                            <div className="upload" style={{width: "75px", height: "28px", overflow: "hidden", display: "inline-block"}}>
                                {util.t("common.selFile")}
                                <input type="file" id="file" onChange={this.readAsDataURL.bind(this)} />
                            </div>
                            <div className="pre-tip" style={{fontSize: "12px"}}>{this.props.tip}</div>
                        </Col>
                    </Row>
                </div>
        );
    }
}

export default ImagePreview;
