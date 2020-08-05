/**
 * Created by bitholic on 16/8/15.
 */

import React from 'react'

import {Alert} from 'antd'


var style={
    paddingTop: 100,
    display: "table",
    width: '50%',
    margin: '0 auto',
};

var HRComp = React.createClass({
    render(){
        return (
            <div style={style}>
                <Alert message="预留模块"
                       description="功能暂未实现,敬请期待!!!"
                       type="info"
                       showIcon
                />
            </div>
        )
    }
});

export default HRComp;
