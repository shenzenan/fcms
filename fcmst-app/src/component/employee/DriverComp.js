/**
 * Created by bitholic on 16/8/14.
 */


import React from 'react';
import {Table} from 'antd';

var DriverComp = React.createClass({
    getInitialState(){
        return {
            data: [],
        }
    },
    componentDidMount(){
        this.getData();
    },
    getData(){
        $.ajax({
            url: "/fcms/api/employee/driver",
            type: 'GET',
            dataType: 'json',
            success: function (sData) {
                if (sData.state == 1) {
                    this.setState({
                        data: sData.drivers
                    })
                }
            }.bind(this)
        });
    },
    render(){
        const columns = [{
            title: '工号',
            dataIndex: 'driverID',
            sorter: (a, b) => a.driverID - b.driverID,
        }, {
            title: '姓名',
            dataIndex: 'name',
            sorter: (a, b) => a.name - b.name,
        }, {
            title: '驾驶证号',
            dataIndex: 'driverLicense',
            sorter: (a, b) => a.driverLicense - b.driverLicense,
        }, {
            title: '操作',
            render: (text, record, index) => (
                //参数分别为当前行的值，当前行数据，行索引
                //<Link to={"/car/"+ text.dirverID}>查看</Link>
                <span>
                    <a href="javascript:void(0)">查看</a>
                    <span className="ant-divider"></span>
                    <a href="javascript:void(0)">修改</a>
                    <span className="ant-divider"></span>
                    <a href="javascript:void(0)" id={text.driverID}>删除</a>
                </span>
            )
        }];
        return (
            <div>
                <Table
                    style={{paddingTop: 40}}
                    rowKey="driverID"
                    columns={columns}
                    dataSource={this.state.data}
                    title={() => '司机列表'}
                    footer={() => '共'+ Math.ceil(this.state.data.length / 10)+ '页, '+ this.state.data.length + '项'}
                />
            </div>
        )
    }
});

export default DriverComp;
