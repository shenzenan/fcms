/**
 * Created by bitholic on 16/8/11.
 */

import React from 'react';
import {Row, Col, Alert, Card, Form, Input, Button, Checkbox } from 'antd';
import { Link } from 'react-router'
const FormItem = Form.Item;

import "../css/login.css"

var counter;

var LoginComp = React.createClass({
    getInitialState(){
        return{
            errorMessage: '',
            secondCount: 5,
        }
    },
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount(){
        if(localStorage.getItem('login') === 'true'){
            counter = setInterval(this.countDown, 1000);
        }
    },
    componentWillUnmount(){
        window.clearInterval(counter);
    },
    handleSubmit(e){
        e.preventDefault();
        var parameters = {
            name: this.props.form.getFieldsValue().userName,
            password: this.props.form.getFieldsValue().password,
            remember: this.props.form.getFieldsValue().remember
        };
        if(typeof(parameters.remember) == 'undefined'){
            parameters.remember = false;
        }
        console.log(parameters);
        if(parameters.name == ""){
            this.setState({errorMessage: "账户名不能为空!"})
        }else if(parameters.password == ""){
            this.setState({errorMessage: "密码不能为空!"})
        }else{
            $.ajax({
                url: '/fcms/api/login' + '?name=' + parameters.name + '&password=' + parameters.password + '&remember=' + parameters.remember,
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    this.setState({
                        errorMessage: data.info
                    });
                    if(data.state == 1){
                        localStorage.setItem('login', 'true');
                        this.context.router.push("home");
                    }
                }.bind(this)
            });
        }
    },
    countDown(){
        var count = this.state.secondCount;
        count--;
        console.log(count);
        if(count >= 0){
            this.setState({
                secondCount: count
            })
        }else{
            window.clearInterval(counter);
            this.context.router.push("home");
        }
    },
    render(){
        const { getFieldProps } = this.props.form;
        if(localStorage.getItem('login') === 'true'){
            return(
                <div id="alreadylogin">
                    <h3>你已经登入系统, {this.state.secondCount} s后将自动跳转到首页...</h3>
                    <h3>如果需要重新登录, 请点击<Link to="/logout">登出</Link>后重新登录.</h3>
                </div>
            )
        }
        return(
            <div>
                <div id="bk"><img src="./src/resource/loginBackground.jpg" /></div>
                <div id="main" style={{paddingTop: 100}}>
                    <Row>
                        <Col span={6} offset={15}>
                            <Card>
                                <h3>厂车管理系统 - 登录</h3>
                                <Form horizontal onSubmit={this.handleSubmit}>
                                    <FormItem
                                        label="账户"
                                    >
                                        <Input placeholder="请输入账户名/工号"
                                            {...getFieldProps('userName') }
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="密码"
                                    >
                                        <Input type="password" placeholder="请输入密码"
                                            {...getFieldProps('password')}
                                        />
                                    </FormItem>
                                    <FormItem>
                                        <Checkbox {...getFieldProps('remember')}>记住我</Checkbox>
                                    </FormItem>
                                    <p style={{color:'red', paddingBottom: 10}}>{this.state.errorMessage}</p>
                                    <Button type="primary" htmlType="submit">登录</Button>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
});

LoginComp = Form.create()(LoginComp);

export default LoginComp;
