/**
 * Created by bitholic on 16/8/1.
 */

import React from 'react'
import { Row, Col, Menu, Icon } from 'antd';

import { Link } from 'react-router'

import '../../css/sider.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


var CarSideNaviComp = React.createClass({
    getInitialState() {
        return {
            current: '1',
        };
    },
    handleClick(e) {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    },
    render() {
        return (
            <div className="div-h">
                <Row className="div-h">
                    <Col span={4} id="leftNavi">
                        <Menu
                            onClick={this.handleClick}
                            defaultOpenKeys={['sub1']}
                            selectedKeys={[this.state.current]}
                            mode="inline"
                            className="div-h"
                        >
                            <SubMenu key="sub1" title={<span><Icon type="appstore" /><span>车辆概况</span></span>}>
                                <MenuItemGroup title="查看">
                                    <Menu.Item key="1"><Link to="/car/all">所有车辆</Link></Menu.Item>
                                    <Menu.Item key="2"><Link to="/car/normal">正常车辆</Link></Menu.Item>
                                    <Menu.Item key="3"><Link to="/car/free">空闲车辆</Link></Menu.Item>
                                    <Menu.Item key="4"><Link to="/car/fault">故障车辆</Link></Menu.Item>
                                </MenuItemGroup>
                                <MenuItemGroup title="添加">
                                    <Menu.Item key="5"><Link to="/car/new">添加车辆</Link></Menu.Item>
                                </MenuItemGroup>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>车辆数据</span></span>}>
                                <Menu.Item key="6"><Link to="/car/download"><Icon type="download" />导出数据</Link></Menu.Item>
                                <Menu.Item key="7"><Link to="/car/upload"><Icon type="upload" />导入数据</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Col>
                    <Col span={16} offset={2} id="content">
                        <div>
                            { this.props.children }
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
});

export default CarSideNaviComp
