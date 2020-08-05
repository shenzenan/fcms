/**
 * Created by bitholic on 16/8/7.
 */

import React from 'react'

import {Card,Timeline } from 'antd'

var CarDetail = React.createClass({
    getInitialState(){
        return {
            licensePlate: this.props.params.licensePlate,
            data: {}
        }
    },
    loadData: function(){
        $.ajax({
            url: "/fcms/api/cars/" + this.state.licensePlate,
            type: 'GET',
            dataType: 'json',
            success: function(sData){
                if(sData.state == 1){
                    this.setState({
                        data: sData.car
                    })
                }
            }.bind(this)
        })
    },
    componentDidMount: function () {
        this.loadData();
    },
    render: function(){
        return (
            <div>
                <Card title={this.state.data.licensePlate} style={{ width: 500 }}>
                    <p>状态: {this.state.data.state}</p>
                    <p>品牌: {this.state.data.trademark}</p>
                    <p>座位数: {this.state.data.seat}</p>
                    <p>行驶证: {this.state.data.vehicleLicense}</p>
                    <p>注册日期: {this.state.data.registerDate}</p>
                    <p>保险日期: {this.state.data.insuranceDate}</p>
                </Card>
                <div style={{paddingTop: 50 }}>
                <Card title="行驶记录" style={{ width: 500}}>
                    <Timeline style={{paddingTop: 20}}>
                        <Timeline.Item>昌平-宏福线班次1 2016-07-01</Timeline.Item>
                        <Timeline.Item>昌平-宏福线班次2 2015-07-01</Timeline.Item>
                        <Timeline.Item>海淀-北邮线班次5 2015-07-03</Timeline.Item>
                        <Timeline.Item>发生故障,维修中 2015-07-03</Timeline.Item>
                    </Timeline>
                </Card>
                </div>
            </div>
        )
    }
});


export default CarDetail;
