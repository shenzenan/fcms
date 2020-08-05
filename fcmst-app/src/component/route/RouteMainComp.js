/**
 * Created by bitholic on 16/8/15.
 */

import React from 'react'
import {Link} from 'react-router'
import {Row, Col, Card} from 'antd'
import G2 from 'g2'

var RouteMainComp = React.createClass({
    componentDidMount(){
        var map1 = new BMap.Map("map1");
        var map2 = new BMap.Map("map2");
        var start = "温都水城";
        var end = "天通西苑北";
        map1.centerAndZoom(new BMap.Point(116.402, 40.109), 12);
        map1.clearOverlays();
        search(map1,start,end,BMAP_DRIVING_POLICY_LEAST_TIME);
        map2.centerAndZoom(new BMap.Point(116.402, 40.109), 12);
        map2.clearOverlays();
        search(map2,end,start,BMAP_DRIVING_POLICY_LEAST_TIME);
        function search(map,start,end,route){
            var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true},policy: route});
            driving.search(start,end);
        }
    },
    render(){
        return (
            <div>
                <Row>
                    <h3 style={{paddingLeft: 50, paddingTop: 50}}>所有路线列表:(点击地图查看详情)</h3>
                    <br />
                    <Col span={5} offset={1}>
                        <Card bordered={false}>
                            <div style={{width: "100%",height: 300}} id="map1"></div>
                            <div>
                                <h3 style={{paddingLeft: 20}}>快三线正</h3>
                                <p>首站: 温都水城, 终点: 天通苑北</p>
                                <p>共 8 站, 24.8 km,耗时42 min 左右.</p>
                                <p><Link to="/station?mode=route">在地图上查看</Link></p>
                            </div>
                        </Card>

                    </Col>
                    <Col span={5} offset={1}>
                        <Card bordered={false}>
                            <div style={{width: "100%",height: 300}} id="map2"></div>
                            <div>
                                <h3 style={{paddingLeft: 20}}>快三线逆</h3>
                                <p>首站: 天通苑北, 终点: 温都水城 </p>
                                <p>共 8 站, 24.8 km,耗时42 min 左右.</p>
                                <p><Link to="/station?mode=route">在地图上查看</Link></p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={5} offset={1}>

                    </Col>
                    <Col span={5} offset={1}>

                    </Col>
                </Row>
            </div>
        )
    }
});


export default RouteMainComp;
