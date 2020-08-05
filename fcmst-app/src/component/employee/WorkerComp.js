/**
 * Created by bitholic on 16/8/14.
 */

import React from 'react'

import {Row, Col, Card, Table} from 'antd'
import G2 from 'g2'

var WorkerComp = React.createClass({
    getInitialState(){
        return{
            department: [
                {name: '生产部', value: 46.33},
                {name: '销售部', value: 24.03},
                {name: '技术部', value: 10.38},
                {name: '行政部', value: 5.91},
                {name: '财务部', value: 5.2},
                {name: '后勤部', value: 4.77},
            ],
            data: [],
            employeeClass: [
                {name: '已分配班次', value: 81},
                {name: '未分配班次', value: 6},
                {name: '无需接送', value: 10},
                {name: '无法接送', value: 3}
            ],
        }
    },
    getData(){
        $.ajax({
            url: "/fcms/api/employee/worker",
            type: 'GET',
            dataType: 'json',
            success: function (sData) {
                if (sData.state == 1) {
                    this.setState({
                        data: sData.employees
                    });
                }
            }.bind(this)
        });
    },
    componentDidMount(){
        this.getData();

        var Stat1 = G2.Stat;
        var chart = new G2.Chart({
            id: 'c1',
            width: 600,
            height: 200,

        });
        chart.source(this.state.department);
        chart.coord('theta',{
            radius: 0.6
        });
        chart.legend('bottom');
        chart.intervalStack()
            .position(Stat1.summary.percent('value'))
            .color('name')
            .label('name*..percent',function(name, percent){
                percent = (percent * 100).toFixed(2) + '%';
                return name + ' ' + percent;
            });
        chart.render();

        var Stat2 = G2.Stat;
        var chart2 = new G2.Chart({
            id: 'c2',
            width: 600,
            height: 200,
        });
        chart2.source(this.state.employeeClass);
        chart2.coord('theta',{
            radius: 0.6
        });
        chart2.legend('bottom');
        chart2.intervalStack()
            .position(Stat2.summary.percent('value'))
            .color('name')
            .label('name*..percent',function(name, percent){
                percent = (percent * 100).toFixed(2) + '%';
                return name + ' ' + percent;
            });
        chart2.render();
    },
    render(){
        const pagination = {
            total: this.state.data.length,
            showSizeChanger: true,
            showQuickJumper: true,
        };
        const columns = [{
            title: '工号',
            dataIndex: 'eid',
            sorter: (a, b) => a.eid - b.eid,
        }, {
            title: '姓名',
            dataIndex: 'name',
            sorter: (a, b) => a.name - b.name,
        }, {
            title: '班次',
            dataIndex: 'eshift',
        }, {
            title: '部门',
            dataIndex: 'department',
        }, {
            title: '组别',
            dataIndex: 'egroup',
        }, {
            title: '地址',
            dataIndex: 'address',
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
                <Row>
                    <Col span={22} offset={1}>
                        <Card bordered={false}>
                            <h3>员工部门分布:</h3>
                            <div id="c1"></div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={22} offset={1}>
                        <Card bordered={false} style={{paddingTop: 50}}>
                            <h3>员工班次分配:</h3>
                            <div id="c2"></div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={22} offset={1}>
                        <Table
                            style={{paddingTop: 40}}
                            rowKey="eid"
                            columns={columns}
                            dataSource={this.state.data}
                            pagination={pagination}
                            title={() => '员工列表'}
                            footer={() => '共' + this.state.data.length + '项'}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
});

export default WorkerComp;
