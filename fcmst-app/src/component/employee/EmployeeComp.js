/**
 * Created by bitholic on 16/8/14.
 */
import React from 'react'
import { Row, Col, Menu, Icon } from 'antd';

import { Link } from 'react-router'

import '../../css/sider.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


var EmployeeComp = React.createClass({
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
                            <SubMenu key="sub1" title={<span><Icon type="team" /><span>员工管理</span></span>}>
                                <MenuItemGroup title="查看">
                                    <Menu.Item key="1"><Link to="/employee/driver">司  机</Link></Menu.Item>
                                    <Menu.Item key="2"><Link to="/employee/worker">普通员工</Link></Menu.Item>
                                </MenuItemGroup>
                                <MenuItemGroup title="添加">
                                    <Menu.Item key="3"><Link to="/employee/new">手动添加</Link></Menu.Item>
                                    <Menu.Item key="4"><Link to="/employee/import">从HR导入</Link></Menu.Item>
                                </MenuItemGroup>
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

export default EmployeeComp
