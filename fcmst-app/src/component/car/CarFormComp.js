/**
 * Created by bitholic on 16/8/2.
 */
import React from 'react'

import { Form, Input, InputNumber, DatePicker, Radio, Button, message} from 'antd'
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

//配置消息的位置和显示持续时间
message.config({
    top: 60,
    duration: 1
});

var CarFormComp = React.createClass({
    handleSubmit: function(e){
        e.preventDefault();
        var formData = this.props.form.getFieldsValue();
        var data = {
            licensePlate: formData.licensePlate,
            trademark: formData.trademark,
            seat: formData.seat,
            registerDate: formData.registerDate.getFullYear()+ "-"
                + (formData.registerDate.getMonth()+ 1) + "-"
                + formData.registerDate.getDate(),
            insuranceDate: formData.insuranceDate.getFullYear()+ "-"
                + (formData.insuranceDate.getMonth()+ 1) + "-"
                + formData.insuranceDate.getDate(),
            vehicleLicense: formData.vehicleLicense,
            state: formData.state
        };
        $.ajax({
            url: '/fcms/api/cars',
            data: JSON.stringify(data),
            type: 'POST',
            contentType: 'application/json',
            success: function(sData){
                //var dataObj = JSON.parse(sData);
                if(sData.state == 1){
                    message.success(sData.info);
                }else if(sData.state == 2){
                    message.warning(sData.info);
                }else{
                    message.error(sData.info);
                }
            }
        });
        console.log(data);
    },
    handleReset: function(){
        message.error('已撤销');
        this.props.form.resetFields();
    },
    render: function(){
        const { getFieldProps } = this.props.form;
        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit}>
                    <FormItem id="licensePlate" label="车牌号" labelCol={{span: 6}} wrapperCol={{span: 10}} required>
                        <Input id="licensePlate" placeholder="请输入车牌号" {...getFieldProps('licensePlate')}/>
                    </FormItem>
                    <FormItem id="trademark" label="品牌" labelCol={{span: 6}} wrapperCol={{span: 10}}>
                        <Input id="trademark" placeholder="请输入品牌" {...getFieldProps('trademark')}/>
                    </FormItem>
                    <FormItem id="seat" label="座位数" labelCol={{span: 6}} required>
                        <InputNumber id="seat" min={0} max={100} style={{ width: 100 }}
                            {...getFieldProps('seat', { initialValue: 30})}/>
                    </FormItem>
                    <FormItem label="注册日期" labelCol={{span: 6}}>
                        <DatePicker {...getFieldProps('registerDate')} />
                    </FormItem>
                    <FormItem label="保险日期" labelCol={{span: 6}}>
                        <DatePicker {...getFieldProps('insuranceDate')} />
                    </FormItem>
                    <FormItem id="vehicleLicense" label="行驶证" labelCol={{span: 6}} wrapperCol={{span: 10}}>
                        <Input id="vehicleLicense" placeholder="请输入行驶证号" {...getFieldProps('vehicleLicense')} />
                    </FormItem>
                    <FormItem label="状态" labelCol={{span: 6}}>
                        <RadioGroup {...getFieldProps('state', {initialValue: 2})}>
                            <RadioButton value={1}>运行</RadioButton>
                            <RadioButton value={2}>空闲</RadioButton>
                            <RadioButton value={0}>故障</RadioButton>
                        </RadioGroup>
                    </FormItem>
                    <FormItem wrapperCol={{ span: 16, offset: 6}} style={{ marginTop: 24 }}>
                        <Button type="ghost" htmlType="reset" onClick={this.handleReset}>重置</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="primary" htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
});

CarFormComp = Form.create()(CarFormComp);
export default CarFormComp;
