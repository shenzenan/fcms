/**
 * Created by bitholic on 16/8/8.
 */

import React from 'react'

import {Upload, Icon, message} from 'antd'
const Dragger = Upload.Dragger;

const props = {
    action: '',
    beforeUpload(file) {
        const isExcel = file.type === 'xls';
        if (!isExcel) {
            message.error('只能上传 excel 文件哦！');
        }
        return isExcel;
    }
};

var UploadComp = React.createClass({
    render(){
        return(
            <div style={{ marginTop: 16, height: 180 }}>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或将文件拖拽到此区域上传</p>
                    <p className="ant-upload-hint">请上传Excel文件,并确保内容结构符合要求,否则将导致失败!</p>
                </Dragger>
            </div>
        )
    }

});

export default UploadComp;
