<%@ page import="org.bitholic.utils.Authentication" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="org.bitholic.utils.DBConnector" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>厂车管理系统| 控制面板</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- 新 Bootstrap 核心 CSS 文件 -->
    <link rel="stylesheet" href="bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<%
    /*
    User user = Authentication.identityVerify(request,response);
    if(user == null){
        out.println("内部错误");
        //response.sendRedirect("login");

    }else if(user.getPrivilege()  == 1){
        //管理员
        out.println("管理员");
    }else if(user.getPrivilege() == 2){
        //司机
        out.println("司机");
        response.sendRedirect("login");

    }else if(user.getPrivilege() == 3){
        //员工
        out.println("员工");
        response.sendRedirect("login");

    }else if(user.getPrivilege() == 4) {
        out.println("未登录用户");
        response.sendRedirect("login");
        //未登录用户

    }
    */
%>
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-header">
        <a href="dashboard.html" class="navbar-brand">厂车管理系统</a>
    </div>
    <div>
        <ul class="nav navbar-nav">
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">站点 <b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a href="#">查看站点 </a></li>
                    <li><a href="#">在地图上查看 </a></li>
                </ul>
            </li>
            <li class="dropdown active">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">路线 <b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a href="#">查看路线 </a></li>
                    <li><a href="#">在地图上查看 </a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">排班 <b class="caret"></b></a>
                <ul class="dropdown-menu">
                    <li><a href="#">周排班表</a></li>
                    <li><a href="#">月排班表</a></li>
                </ul>
            </li>
            <li><a href="#">车辆管理</a></li>
            <li><a href="#">员工管理</a></li>
            <li><a href="#">统计查询</a></li>
        </ul>
    </div>
    <div>
        <p class="navbar-text pull-right"><a href="#">注销</a></p>
        <p class="navbar-text pull-right">|</p>
        <p class="navbar-text pull-right">用户名</p>
    </div>
</nav>

<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="js/jquery-1.12.3.js"></script>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="bootstrap/js/bootstrap.js"></script>
</body>
</html>
