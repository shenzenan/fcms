/**
 * Created by bitholic on 16/8/8.
 */

import React from 'react'

import {Row, Col, Button, Icon, Select, notification} from 'antd'

const Option = Select.Option;

notification.config({
    top: 100,
    duration: 2,
});

var Download = React.createClass({
    handleDownload(){
        $.ajax({
            url: "/fcms/car/download",
            type: 'GET',
            success: function(){
                window.location="/fcms/file/厂车信息.xls";
                notification.open({
                    message: '提示',
                    description: '下载成功!',
                });
            }.bind(this),
            error: function(){
                notification.open({
                    message: '提示',
                    description: '下载失败!',
                });
            }.bind(this)
        });
    },
    render(){
        return(
            <div style={{ paddingTop: 80}}>
                <Row>
                    <Col span={10} offset={7}>
                        <Select  placeholder="请选择文件格式" style={{ width: 200 }}>
                            <Option value="xls">xls格式</Option>
                            <Option value="xlsx">xlsx格式</Option>
                            <Option value="csv">csv格式</Option>
                        </Select>
                        <div style={{paddingTop: 30}}>
                            <Button type="dashed" size="large" style={{ width: 200}} onClick={this.handleDownload}>点击下载<Icon type="download"/></Button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
});

export default Download;
