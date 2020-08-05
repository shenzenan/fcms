<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="zh-CN">
<head>
    <title>厂车管理系统 | 所有厂车</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="js/pace.js"></script>
    <link rel="stylesheet" href="css/pace-theme-minimal.css"/>

    <link rel="stylesheet" href="bootstrap/css/bootstrap.css"/>
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap3-dialog/1.34.7/css/bootstrap-dialog.min.css">
    <link rel="stylesheet" href="css/framework.css"/>
</head>
<body>
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                    aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="dashboard.html" class="navbar-brand">厂车管理系统</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">站点 <b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">查看站点 </a></li>
                        <li><a href="#">在地图上查看 </a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">路线 <b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">查看路线 </a></li>
                        <li><a href="#">在地图上查看 </a></li>
                    </ul>
                </li>
                <li><a href="#">班次管理</a></li>
                <li class="active"><a href="#">车辆管理</a></li>
                <li><a href="#">员工管理</a></li>
                <li><a href="#">统计查询</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">管理员 <b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">查看账户</a></li>
                        <li><a href="#">我的消息</a></li>
                        <li class="divider">&nbsp;</li>
                        <li><a href="#">注销登录</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>


<div class="container-fluid">
    <div class="row">
        <div class="col-sm-3 col-md-3 sidebar">
            <div class="input-group">
                <div class="input-group-btn search-panel">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        <span id="search-concept">车牌号 </span><span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#licensePlate">车牌号 </a></li>
                        <li><a href="#trademark">品牌 </a></li>
                        <li><a href="#seat">座位数 </a></li>
                        <li><a href="#vehicleLicense">行驶证 </a></li>
                    </ul>
                </div>
                <input type="hidden" name="search-param" value="licensePlate" id="search-param">
                <input type="text" class="form-control" name="x" placeholder="搜索" required>
                <span class="input-group-btn">
                    <button id="search" class="btn btn-default" type="button"><span
                            class="glyphicon glyphicon-search"></span></button>
                </span>
            </div>

            <ul class="nav nav-sidebar">
                <li id="overview" class="active"><a href="#">车辆概况 </a></li>
                <li id="all-car"><a href="#">所有车辆</a></li>
                <li id="fault-car"><a href="#">故障车辆</a></li>
                <li id="add-car"><a href="#">添加车辆</a></li>
                <li id="export-data"><a href="#">导出数据</a></li>
            </ul>
        </div>

        <div class="col-sm-9 col-sm-offset-3 col-md-9 col-md-offset-3 main">
            <div class="row placeholders">
                <div id="overview-page" class="show"></div>
            </div>
        </div>
    </div>
</div>

<script src="js/jquery-1.12.3.js"></script>
<script src="bootstrap/js/bootstrap.js"></script>

</body>
</html>
