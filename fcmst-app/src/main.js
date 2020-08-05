/**
 * Created by bitholic on 16/8/1.
 */

import React from 'react'
import { render } from 'react-dom'
//Router组件本身只是一个容器，真正的路由要通过Route组件定义
import { Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router'
//antd组件
import {Row, Col, Menu, Icon, Badge} from 'antd';
const SubMenu = Menu.SubMenu;

import HomeComp from './component/HomeComp.js';

import MapTestComp from './component/station/StationMainComp.js';

import LoginComp from './component/Login.js'

import RouteMainComp from './component/route/RouteMainComp.js'

import CarSideNaviComp from './component/car/CarSideNavi.js'
import CarDetail from './component/car/CarDetailComp.js'
import {CarTable,AllCarTable,NormalCarTable, FaultCarTable, FreeCarTable} from './component/car/CarTableComp.js'
import CarFormComp from './component/car/CarFormComp.js'
import Download from './component/car/DownloadComp.js'
import UploadComp from './component/car/UploadComp.js'

import EmployeeComp from './component/employee/EmployeeComp.js'
import DriverComp from './component/employee/DriverComp.js'
import WorkerComp from './component/employee/WorkerComp.js'
import AddEmployeeComp from './component/employee/AddEmployeeComp.js'
import HRComp from './component/employee/HRComp.js'

import StatisticsComp from './component/statistics/StatisticsComp.js'
import MessageComp from './component/MessageComp.js'
import './css/main.css'

var AppMainComp = React.createClass({
    render(){
        return (
            <div id="root">
                <div id="topNavi">
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="fcms">
                            <Link to="/home">厂车管理系统 </Link>
                        </Menu.Item>
                        <Menu.Item key="home">
                            <Link to="/home"><Icon type="home"/> 首页 </Link>
                        </Menu.Item>
                        <Menu.Item key="station">
                            <Link to="/station"><Icon type="pushpin-o"/> 站点</Link>
                        </Menu.Item>
                        <Menu.Item key="route">
                            <Link to="/route"><Icon type="share-alt"/> 路线 </Link>
                        </Menu.Item>
                        <Menu.Item key="car">
                            <Link to="/car">车辆管理 </Link>
                        </Menu.Item>
                        <Menu.Item key="employee">
                            <Link to="/employee">员工管理 </Link>
                        </Menu.Item>
                        <Menu.Item key="report">
                            <Link to="/statistics"><Icon type="bar-chart" />统计查询 </Link>
                        </Menu.Item>
                        <SubMenu key="user" title={<span><Badge dot>admin(管理员) <Icon type="notification"/></Badge></span>}>
                            <Menu.Item key="profile"><Icon type="solution" />我的资料</Menu.Item>
                            <Menu.Item key="message"><Link to="/message">
                                <Badge count={2}><span><Icon type="mail" />我的消息 </span></Badge>
                            </Link></Menu.Item>
                            <Menu.Item key="logout"><hr/><Link to="logout"><Icon type="logout"/>登出</Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div id="main">
                    { this.props.children }
                </div>
            </div>
        )
    }
});

var LogoutComp = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    componentDidMount(){
        localStorage.setItem('login','false');
        this.context.router.push("login");
    },
    render(){
        return null;
    }
});

//IndexRoute component={LoginComp}/>
//配置路由
render((
    <Router history={hashHistory}>
        <Route path="/" component={AppMainComp}>
            <IndexRoute component={HomeComp} />
            <Route path="/home" component={HomeComp}></Route>
            <Route path="/route" component={RouteMainComp}></Route>
            <Route path="/car" onEnter={authorization} component={CarSideNaviComp}>
                <IndexRoute component={AllCarTable}/>
                <Route path="all" component={AllCarTable} />
                <Route path="normal" component={NormalCarTable} />
                <Route path="free" component={FreeCarTable} />
                <Route path="fault" component={FaultCarTable} />
                <Route path="new" component={CarFormComp} />
                <Route path="download" component={Download} />
                <Route path="upload" component={UploadComp} />
                <Route path=":licensePlate" component={CarDetail} />
            </Route>
            <Route path="/employee" component={EmployeeComp}>
                <IndexRoute component={DriverComp}/>
                <Route path="driver" component={DriverComp} />
                <Route path="worker" component={WorkerComp} />
                <Route path="new" component={AddEmployeeComp} />
                <Route path="import" component={HRComp} />
            </Route>
            <Route path="/statistics" component={StatisticsComp}></Route>
            <Route path="/station" component={MapTestComp}></Route>
            <Route path="/message" component={MessageComp}></Route>
        </Route>
        <Route path="/login" component={LoginComp} />
        <Route path="/logout" component={LogoutComp} />
    </Router>
), document.getElementById('app'));

function hasLogin() {
    return localStorage.getItem('login') === 'true';
}

function authorization(nextState, replace){
    if(!hasLogin()){
        replace('/login');
    }
}
//antd聚焦的bug
