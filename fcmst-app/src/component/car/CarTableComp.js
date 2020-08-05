/**
 * Created by bitholic on 16/8/1.
 */

import React from 'react'
import {Link} from 'react-router'

import {Row, Col, Table, Form, Input, Select, Icon, message, Button, Modal} from 'antd'

const FormItem = Form.Item;
const Option = Select.Option;

message.config({
    top: 60,
    duration: 1
});


var CarTable = React.createClass({
    propTypes: {
        carClass: React.PropTypes.string.isRequired,
    },
    getInitialState(){
        var tmp = this.props.carClass;
        var url;
        if(tmp == "fault"){
            url = '/fcms/api/cars?class=0';
        }else if(tmp == "normal"){
            url = '/fcms/api/cars?class=1';
        }else if(tmp == "free"){
            url = '/fcms/api/cars?class=2';
        }else{
            url = '/fcms/api/cars';
        }

        return {
            data: [],
            url: url,
            visible: false,
            id: "",
            selectValue: "licensePlate",
            searchContent: "",
        }
    },
    componentDidMount: function () {
        this.getData();
    },
    getData(){
        $.ajax({
            url: this.state.url,
            dataType: 'json',
            success: function (sData) {
                if(sData.state == 1) {
                    for(var i = 0; i < sData.cars.length; i++){
                        var s = sData.cars[i].state;
                        if(s == 1){
                            sData.cars[i].state = "正常运行"
                        }else if(s == 2){
                            sData.cars[i].state = "空闲中"
                        }else if(s == 0){
                            sData.cars[i].state = "故障"
                        }
                    }
                    this.setState({
                        data: sData.cars
                    });
                }
            }.bind(this)
        })
    },
    handleSearch(){
        $.ajax({
            url: this.state.url,
            dataType: 'json',
            success: function (sData) {
                if(sData.state == 1) {
                    for(var i = 0; i < sData.cars.length; i++){
                        var s = sData.cars[i].state;
                        if(s == 1){
                            sData.cars[i].state = "正常运行"
                        }else if(s == 2){
                            sData.cars[i].state = "空闲中"
                        }else if(s == 0){
                            sData.cars[i].state = "故障"
                        }
                    }
                    this.setState({
                        data: sData.cars.filter(function(currentValue){
                            if(this.state.selectValue == "licensePlate"){
                                return currentValue.licensePlate == this.state.searchContent;
                            }else if(this.state.selectValue == "trademark"){
                                return currentValue.trademark == this.state.searchContent;
                            }else if(this.state.selectValue == "seat"){
                                return currentValue.seat == this.state.searchContent;
                            }else{
                                return currentValue.vehicleLicense == this.state.searchContent;
                            }
                        }.bind(this))
                    });
                }
            }.bind(this)
        });
    },
    handleSelect(value){
        this.setState({
            selectValue: value
        });
    },
    handleInputChange(e){
        this.setState({
            searchContent: e.target.value
        });
    },
    showModal(e){
        var keyValue = e.target.id;
        this.setState({
            visible: true,
            id: keyValue
        })
    },
    handleCancel(e){
        console.log(e);
        this.setState({
            visible: false,
            id: ""
        })
    },
    handleDelete(){
        $.ajax({
            url: "/fcms/api/cars/" + this.state.id,
            type: "DELETE",
            success: function(data){
                if(data.state == 1){
                    message.success(data.info);
                    this.getData();
                    this.setState({
                        visible: false,
                        id: ""
                    });
                }else{
                    message.error(data.info);
                }
            }.bind(this)
        });
    },

    render: function () {
        const selectBefore = (
            <Select
                defaultValue="licensePlate"
                onSelect={this.handleSelect}
                style={{ width: 80 }}
            >
                <Option value="licensePlate">车牌号</Option>
                <Option value="trademark">品牌 </Option>
                <Option value="seat">座位数</Option>
                <Option value="vehiclePlate">行驶证</Option>
            </Select>
        );
        const selectAfter = (
            <a onClick={this.handleSearch}><Icon type="search"/></a>
        );
        const columns = [{
            title: '车牌号',
            dataIndex: 'licensePlate',
            sorter: (a, b) => a.licensePlate - b.licensePlate,
        }, {
            title: '品牌',
            dataIndex: 'trademark',
            sorter: (a, b) => a.trademark - b.trademark,
        }, {
            title: '座位数',
            dataIndex: 'seat',
            sorter: (a, b) => a.seat - b.seat,
        }, {
            title: '注册日期',
            dataIndex: 'registerDate',
            sorter: (a, b) => a.registerDate - b.registerDate,
        }, {
            title: '保险日期',
            dataIndex: 'insuranceDate',
            sorter: (a, b) => a.insuranceDate - b.insuranceDate,
        }, {
            title: '行驶证',
            dataIndex: 'vehicleLicense',
            sorter: (a, b) => a.vehicleLicense - b.vehicleLicense,
        }, {
            title: '状态',
            dataIndex: 'state',
        }, {
            title: '操作',
            render: (text,record,index) => (
                //参数分别为当前行的值，当前行数据，行索引
                <span>
                    <Link to={"/car/"+ text.licensePlate}>查看</Link>
                    <span className="ant-divider"></span>
                    <a href="#">修改</a>
                    <span className="ant-divider"></span>
                    <a href="javascript:void(0)" id={text.licensePlate} onClick={this.showModal}>删除</a>
                </span>
            )
        }];

        return (
            <div>
                <Row>
                    <Col span={8} offset={16} >
                        <div>
                            <Input addonBefore={selectBefore} addonAfter={selectAfter} placeholder="请输入搜索内容" onChange={this.handleInputChange} onPressEnter={this.handleSearch}/>
                        </div>
                    </Col>
                </Row>
                <Table
                    style={{paddingTop: 40}}
                    rowKey="licensePlate"
                    columns={columns}
                    dataSource={this.state.data}
                    bordered
                    title={() => '所有厂车列表'}
                    footer={() => '共'+ Math.ceil(this.state.data.length / 10)+ '页, '+ this.state.data.length + '项'}
                />
                <Modal visible={this.state.visible}
                       title="提示"
                       onOk={this.handleDelete} onCancel={this.handleCancel}>
                    <p>{"确定要删除车牌为"+ this.state.id +"的车的相关数据吗?"}</p>
                </Modal>
            </div>
        )
    }
});


var AllCarTable = React.createClass({
    render(){
        return(
            <div>
                <CarTable carClass="all"/>
            </div>
        )
    }
});
var FaultCarTable = React.createClass({
    render(){
        return(
            <div>
                <CarTable carClass="fault"/>
            </div>
        )
    }
});
var NormalCarTable = React.createClass({
    render(){
        return(
            <div>
                <CarTable carClass="normal"/>
            </div>
        )
    }
});
var FreeCarTable = React.createClass({
    render(){
        return(
            <div>
                <CarTable carClass="free"/>
            </div>
        )
    }
});

export default CarTable;
export {AllCarTable, FaultCarTable, NormalCarTable, FreeCarTable}
