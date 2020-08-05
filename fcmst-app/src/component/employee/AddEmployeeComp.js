/**
 * Created by bitholic on 16/8/14.
 */

import React from 'react'

import {Row, Col, Steps, Select, Button,Radio, Input, Form} from 'antd'
const Step = Steps.Step;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

var AddEmployeeComp = React.createClass({
    getInitialState(){
        return {
            current: 0,
            type: 'driver',
        }
    },
    handleChange(e){
        this.setState({
            type: e
        })
    },
    begin(){
        this.setState({
            current: 0,
            type: 'driver',
        });
    },
    previous(){
        this.setState({
            current: this.state.current - 1
        });
    },
    next(){
        this.setState({
            current: this.state.current + 1
        });
    },
    render(){
        var page;
        if(this.state.current == 0){
            page = (
                <div>
                    <h3>请选择员工类型:</h3>
                    <br />
                    <Select defaultValue="driver" style={{ width: 350 }} onChange={this.handleChange}>
                        <Option value="driver">司机</Option>
                        <Option value="worker">普通员工</Option>
                    </Select>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={this.next}>下一步</Button>
                </div>
            )
        }else if(this.state.current == 1 && this.state.type == 'driver'){
            page = (
                <div>
                    <Form horizontal>
                        <FormItem id="driverID" label="员工号" labelCol={{span: 6}} wrapperCol={{span: 10}} required>
                            <Input id="driverID" placeholder="请输入驾驶员员工号" />
                        </FormItem>
                        <FormItem id="name" label="姓 名" labelCol={{span: 6}} wrapperCol={{span: 10}} required>
                            <Input id="name" placeholder="请输入驾驶员姓名" />
                        </FormItem>
                        <FormItem id="driverLicense" label="驾驶证" labelCol={{span: 6}} wrapperCol={{span: 10}} required>
                            <Input id="driverLicense" placeholder="请输入驾驶员驾驶证号"  />
                        </FormItem>
                        <FormItem wrapperCol={{ span: 16, offset: 6}} style={{ marginTop: 24 }}>
                            <Button type="ghost" onClick={this.previous}>上一步</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button type="primary" onClick={this.next}>下一步</Button>
                        </FormItem>
                    </Form>
                </div>
            );
        }else if(this.state.current == 1 && this.state.type == 'worker'){
            page = (
                <div>
                    <Form horizontal>
                        <FormItem id="eid" label="员工号" labelCol={{span: 6}} wrapperCol={{span: 10}} required>
                            <Input id="eid" placeholder="请输入员工号" />
                        </FormItem>
                        <FormItem id="name" label="姓 名" labelCol={{span: 6}} wrapperCol={{span: 10}} required>
                            <Input id="name" placeholder="请输入员工姓名" />
                        </FormItem>
                        <FormItem id="eshift" label="班 次" labelCol={{ span: 6 }} >
                            <RadioGroup defaultValue="0">
                                <RadioButton value="0">白 班</RadioButton>
                                <RadioButton value="1">夜 班</RadioButton>
                            </RadioGroup>
                        </FormItem>
                        <FormItem id="department" label="部 门" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }} >
                            <Select id="department" size="large" defaultValue="0" style={{ width: 300 }}>
                                <Option value="0">销售部</Option>
                                <Option value="1">生产部</Option>
                                <Option value="2">行政部</Option>
                                <Option value="3">财务部</Option>
                                <Option value="4">技术部</Option>
                                <Option value="5">后勤部</Option>
                                <Option value="6">其  它</Option>
                            </Select>
                        </FormItem>
                        <FormItem id="egroup" label="组 别" labelCol={{span: 6}} wrapperCol={{span: 10}} required>
                            <Input id="egroup" placeholder="请输入员工组别"  />
                        </FormItem>
                        <FormItem id="address" label="地 址" labelCol={{span: 6}} wrapperCol={{span: 10}} required>
                            <Input id="address" placeholder="请选择员工地址"  />
                        </FormItem>
                        <FormItem wrapperCol={{ span: 16, offset: 6}} style={{ marginTop: 24 }}>
                            <Button type="ghost" onClick={this.previous}>上一步</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button type="primary" onClick={this.next}>下一步</Button>
                        </FormItem>
                    </Form>
                </div>
            )
        }else if(this.state.current == 2 ){
            page = (
                <div>
                    <Button type="ghost" onClick={this.previous}>上一步</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="ghost" disabled >更多操作</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={this.begin}>继续添加</Button>
                </div>
            )
        }
        return(
            <div>
                <div style={{paddingTop: 50, paddingBottom: 20}}>
                    <Steps current={this.state.current}>
                        <Step title="选择类型" description="请选择将要添加的员工类型 "></Step>
                        <Step title="详细资料" description="输入相应类型员工的详细资料"></Step>
                        <Step title="相关操作" description="对新添加的员工进行相关操作"></Step>
                    </Steps>
                </div>
                <hr />
                <div style={{paddingTop: 50}}>
                    {page}
                </div>
            </div>
        )
    }
});

export default AddEmployeeComp;
