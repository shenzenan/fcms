/**
 * Created by bitholic on 16/8/13.
 */

import React from 'react'

import { Row, Col, Card, Progress} from 'antd'

import G2 from 'g2'

import '../css/home.css'

var HomeComp = React.createClass({
    getInitialState(){
        return{
            data: [
                {genre: 'Sports', sold: 275},
                {genre: 'Strategy', sold: 115},
                {genre: 'Action', sold: 120},
                {genre: 'Shooter', sold: 350},
                {genre: 'Other', sold: 150},
            ]
        }
    },
    componentDidMount(){
        var chart = new G2.Chart({
            id: 'c1', // 指定图表容器 ID
            width : 600, // 指定图表宽度
            height : 400 // 指定图表高度
        });
        // Step 2: 载入数据源
        chart.source(this.state.data, {
            genre: {
                alias: '游戏种类' // 列定义，定义该属性显示的别名
            },
            sold: {
                alias: '销售量'
            }
        });
        // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
        chart.interval().position('genre*sold').color('genre');
        // Step 4: 渲染图表
        chart.render();
    },
    render(){
        return (
            <div id="container">
                <Row>
                    <Col span={7} offset={1}>
                        <Card bordered={false} className="card-h">
                            <h3>厂 车 总 览</h3>
                            <hr/><br />
                            <p>总厂车数目 : 41</p>
                            <p>故障厂车数目 : 0</p>
                            <p>空闲厂车数目 : 5</p>
                            <p>厂车使用率: </p>
                            <Progress percent={87} strokeWidth={5}/>
                        </Card>
                    </Col>
                    <Col span={7} offset={1}>
                        <Card bordered={false} className="card-h">
                            <h3>员 工 总 览</h3>
                            <hr/> <br />
                            <p>总员工数目: 534</p>
                            <p>已安排员工: 488</p>
                            <p>待安排员工: 20</p>
                        </Card>
                    </Col>
                    <Col span={6} offset={1}>
                        <Card bordered={false} className="card-h">
                            <h3>线 路 总 览</h3>
                            <hr /><br />
                            <p>线路总数: 2</p>
                            <p>是否需要添加线路: 否</p>
                        </Card>
                    </Col>
                </Row>
                <Row style={{paddingTop: 50}}>
                    <Col span={22} offset={1}>
                        <Card bordered={false}>
                            <h3 style={{paddingBottom: 10}}>我 需 留 意</h3>
                            <hr /> <br />
                            <p>暂无消息!</p>
                        </Card>
                    </Col>
                </Row>
                <Row style={{paddingTop: 50}}>
                    <Col span={22} offset={1}>
                        <Card bordered={false}>
                            <h3 style={{paddingBottom: 10}}>班 次 信 息</h3>
                            <Row>
                                <Col span={10} offset={1}>
                                    <Card bordered={false} className="shift-c">
                                        <h3 className="text-center">今 日 班 次</h3>
                                        <hr /><br />
                                        <p>7:30  -  快三线正 班次一</p>
                                        <p>7:50  -  快三线正 班次二</p>
                                        <p>8:00  -  快三线正 班次三</p>
                                        <p>8:10  -  快三线正 班次四</p>
                                        <p>8:30  -  快三线正 班次五</p>
                                        <p>16:40  -  快三线逆 班次一</p>
                                        <p>16:50  -  快三线逆 班次二</p>
                                        <p>17:00  -  快三线逆 班次三</p>
                                        <p>17:10  -  快三线逆 班次四</p>
                                        <p>17:30  -  快三线逆 班次五</p>
                                        <p>......</p>
                                        <br />
                                        <p><a href="javascript:void(0)">查看更多</a></p>
                                    </Card>
                                </Col>
                                <Col span={10} offset={2}>
                                    <Card bordered={false} className="shift-c">
                                        <h3 className="text-center">下 周 班 次</h3>
                                        <hr /><br /><br />
                                        <p>下周暂未排班, <a href="javascript:void(0)">去安排</a></p>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row style={{paddingTop: 50}}>
                    <Col span={22} offset={1}>
                        <Card bordered={false}>
                            <div id="c1"></div>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
});

export default HomeComp;
