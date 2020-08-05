/**
 * Created by bitholic on 16/8/13.
 */

import React from 'react'

import { Row, Col,Tabs, Badge, Table, Button, Icon, Form, Input } from 'antd'
const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const FormItem = Form.Item;

var MessageComp = React.createClass({
    render(){
        return (
            <Tabs tabPosition='left'>
                <TabPane tab={<span><Icon type="edit" />写  信 </span>} key="1">
                    <div>
                        <WriteMessageComp />
                    </div>
                </TabPane>
                <TabPane tab={<span><Icon type="mail" />收  信 </span>} key="2">
                    <Tabs type="card" style={{paddingTop: 30}}>
                        <TabPane tab={<span><Badge count={2}><Icon type="mail" />未读信息 </Badge></span>} key="sub1">
                            <div><MessageTable /></div>
                        </TabPane>
                        <TabPane tab="已读信息" key="sub2">已读信息</TabPane>
                        <TabPane tab="群发信息" key="sub3">群发信息</TabPane>
                    </Tabs>
                </TabPane>
                <TabPane tab={<span><Icon type="setting" />设  置 </span>} key="3">选项卡三内容</TabPane>
            </Tabs>
        )
    }
});

var MessageTable = React.createClass({
    getInitialState() {
        return {
            selectedRowKeys: [],
            data: [],
        };
    },
    componentDidMount(){
        var sData = [{
            sender: 'xq',
            title: '厂车管理系统',
            time: '2015-8-8 12:20:35'
        }, {
            sender: 'sdd',
            title: '厂车管理系统 - 版本2',
            time: '2015-8-9 12:20:35'
        }];
        this.setState({
            data: sData
        });
    },
    onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    },
    render(){
        const columns = [{
            title: '发件人',
            dataIndex: 'sender',
        }, {
            title: '主题',
            dataIndex: 'title',
        }, {
            title: '时间',
            dataIndex: 'time',
        }, {
            title: '操作',
            render: (text, record, index) => (
                <span>
                    <a href="javascript:void(0)">查 看</a>
                    <span className="ant-divider"></span>
                    <a href="javascript:void(0)">删 除</a>
                </span>
            )
        }];
        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div style={{paddingTop: 20}}>
                <div style={{float: 'right'}}>
                    <ButtonGroup>
                        <Button >删除选择项</Button>
                        <Button >标记为已读</Button>
                        <Button >全部标记为已读</Button>
                    </ButtonGroup>
                </div>
                <div style={{paddingTop: 50}}>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data}/>
                </div>
            </div>
        )
    }
});

var WriteMessageComp = React.createClass({
    render(){
        return (
            <div style={{paddingTop: 50}}>
                <Form horizontal>
                    <FormItem
                        id="receiver-input"
                        label="收件人"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Input id="receiver-input" placeholder="输入或选择收件人"/>
                    </FormItem>
                    <FormItem
                        id="tile-input"
                        label="主题"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Input id="title-input" placeholder="请输入消息主题"/>
                    </FormItem>
                    <FormItem
                        id="content-input"
                        label="正文"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Input type="textarea" id="control-textarea" rows="10"/>
                    </FormItem>
                    <FormItem wrapperCol={{ span: 16, offset: 6}} style={{ marginTop: 24 }}>
                        <Button type="ghost" htmlType="reset" onClick={this.handleReset}>重置</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="primary" htmlType="submit">发送</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
});


export default MessageComp;
