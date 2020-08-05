/**
 * Created by bitholic on 16/8/15.
 */

import React from 'react'

import {Row, Col, Tabs, DatePicker, Select, Button} from 'antd'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

import G2 from 'g2'

var style={
    paddingTop: 100,
    display: "table",
    width: '80%',
    margin: '0 auto',
};

var styleTop = {
    paddingTop: 50
};

var StatisticsComp = React.createClass({
    getInitialState(){
        return{
            data1: [
                {name: '快三线正', time: Date.UTC(2016, 6, 1), value: 81},
                {name: '快三线正', time: Date.UTC(2016, 6, 2), value: 92},
                {name: '快三线正', time: Date.UTC(2016, 6, 3), value: 88},
                {name: '快三线正', time: Date.UTC(2016, 6, 4), value: 85},
                {name: '快三线正', time: Date.UTC(2016, 6, 5), value: 96},
                {name: '快三线正', time: Date.UTC(2016, 6, 6), value: 91},
                {name: '快三线正', time: Date.UTC(2016, 6, 7), value: 90},
                {name: '快三线正', time: Date.UTC(2016, 6, 8), value: 82},
                {name: '快三线正', time: Date.UTC(2016, 6, 9), value: 83},
                {name: '快三线正', time: Date.UTC(2016, 6, 10), value: 88},
                {name: '快三线正', time: Date.UTC(2016, 6, 11), value: 90},
                {name: '快三线正', time: Date.UTC(2016, 6, 12), value: 89},
                {name: '快三线正', time: Date.UTC(2016, 6, 13), value: 89},
                {name: '快三线正', time: Date.UTC(2016, 6, 14), value: 84},
                {name: '快三线正', time: Date.UTC(2016, 6, 15), value: 85},
                {name: '快三线正', time: Date.UTC(2016, 6, 16), value: 81},
                {name: '快三线正', time: Date.UTC(2016, 6, 17), value: 91},
                {name: '快三线正', time: Date.UTC(2016, 6, 18), value: 92},
                {name: '快三线正', time: Date.UTC(2016, 6, 19), value: 94},
                {name: '快三线正', time: Date.UTC(2016, 6, 20), value: 92},
            ],
            data3: [
                {name: '温度水城', time: Date.UTC(2016, 6, 1), value: 91},
                {name: '温度水城', time: Date.UTC(2016, 6, 2), value: 92},
                {name: '温度水城', time: Date.UTC(2016, 6, 3), value: 94},
                {name: '温度水城', time: Date.UTC(2016, 6, 4), value: 95},
                {name: '温度水城', time: Date.UTC(2016, 6, 5), value: 97},
                {name: '温度水城', time: Date.UTC(2016, 6, 6), value: 93},
                {name: '温度水城', time: Date.UTC(2016, 6, 7), value: 92},
                {name: '温度水城', time: Date.UTC(2016, 6, 8), value: 94},
                {name: '温度水城', time: Date.UTC(2016, 6, 9), value: 94},
                {name: '温度水城', time: Date.UTC(2016, 6, 10), value: 94},
                {name: '温度水城', time: Date.UTC(2016, 6, 11), value: 96},
                {name: '温度水城', time: Date.UTC(2016, 6, 12), value: 90},
                {name: '温度水城', time: Date.UTC(2016, 6, 13), value: 90},
                {name: '温度水城', time: Date.UTC(2016, 6, 14), value: 92},
                {name: '温度水城', time: Date.UTC(2016, 6, 15), value: 91},
                {name: '温度水城', time: Date.UTC(2016, 6, 16), value: 95},
                {name: '温度水城', time: Date.UTC(2016, 6, 17), value: 93},
                {name: '温度水城', time: Date.UTC(2016, 6, 18), value: 93},
                {name: '温度水城', time: Date.UTC(2016, 6, 19), value: 93},
                {name: '温度水城', time: Date.UTC(2016, 6, 20), value: 94},
                {name: '温度水城', time: Date.UTC(2016, 6, 21), value: 97},
            ]
        }
    },
    componentDidMount(){
    },
    handleRouteSearch(){
        var chart = new G2.Chart({
            id: 'c1',
            width: 1000,
            height: 400,
            plotCfg: {
                margin: [20, 80, 100, 80]
            }
        });
        chart.source(this.state.data1, {
            time: {
                type: 'time',
                mask: 'yy-mm-dd',
                alias: '日期'
            },
            value: {
                alias: '乘坐率(%)'
            }
        });
        chart.legend('bottom');
        chart.line().position('time*value').color('name').shape('smooth').size(2);
        chart.point().position('time*value').color('name').shape('name', ['circle', 'rect', 'diamond']).size(4);
        chart.render();
    },
    handleStationSearch(){
        var chart = new G2.Chart({
            id: 'c3',
            width: 1000,
            height: 400,
            plotCfg: {
                margin: [20, 80, 100, 80]
            }
        });
        chart.source(this.state.data3, {
            time: {
                type: 'time',
                mask: 'yy-mm-dd',
                alias: '日期'
            },
            value: {
                alias: '乘坐率(%)'
            }
        });
        chart.legend('bottom');
        chart.line().position('time*value').color('name').shape('smooth').size(2);
        chart.point().position('time*value').color('name').shape('name', ['circle', 'rect', 'diamond']).size(4);
        chart.render();
    },
    render(){
        const disabledDate = function (current) {
            // can not select days after today
            return current && current.getTime() > Date.now();
        };

        return (
            <div style={style}>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="按路线查询" key="1">
                        <Row style={styleTop}>
                            <Col span={4} offset={2}>
                                <Select defaultValue="快三线正">
                                    <Option value="快三线正">快三线正</Option>
                                    <Option value="快三线逆">快三线逆</Option>
                                </Select>
                            </Col>
                            <Col span={9} offset={1}>
                                <RangePicker disabledDate={disabledDate} />
                            </Col>
                            <Col span={2} offset={2}>
                                <Button type="primary" icon="search" onClick={this.handleRouteSearch}>查询</Button>
                            </Col>
                        </Row>
                        <Row style={style}>
                            <Col span={20} offset={2}>
                                <div id='c1'></div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="按班次查询" key="2">选项卡二内容</TabPane>
                    <TabPane tab="按站点查询" key="3">
                        <Row style={styleTop}>
                            <Col span={4} offset={2}>
                                <Select defaultValue="温度水城">
                                    <Option value="温度水城">温都水城</Option>
                                    <Option value="王府温馨公寓">王府温馨公寓</Option>
                                    <Option value="平西王府西">平西王府西</Option>
                                </Select>
                            </Col>
                            <Col span={9} offset={1}>
                                <RangePicker disabledDate={disabledDate} />
                            </Col>
                            <Col span={2} offset={2}>
                                <Button type="primary" icon="search" onClick={this.handleStationSearch}>查询</Button>
                            </Col>
                        </Row>
                        <Row style={style}>
                            <Col span={20} offset={2}>
                                <div id='c3'></div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="混合查询" key="4">混合查询 </TabPane>
                </Tabs>
            </div>
        )
    }
});

export default StatisticsComp;
