<%@ page import="org.bitholic.utils.Authentication" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    if (Authentication.identityVerify(request, response) != null) {
        response.sendRedirect("dashboard.html");
    }
%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>厂车管理系统 | 登录</title>
    <link rel="stylesheet" href="css/login.css" />
</head>
<body>
<!--
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="pr-wrap">
                <div class="pass-reset">
                    <label>忘记密码请联系管理员!</label>
                </div>
            </div>
            <div class="wrap">
                <p class="form-title">厂车管理系统 - 登录</p>
                <form class="login">
                    <input type="text" placeholder="用户名/员工号" />
                    <input type="password" placeholder="密码" />
                    <input type="submit" class="btn btn-success btn-sm" />
                    <div class="remember-forgot">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" />记住我 </label>
                                </div>
                            </div>
                            <div class="col-md-6 forgot-pass-content">
                                <a href="javascription:void(0)" class="forgot-pass">忘记密码 </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
-->
<form method="post" action="handleLogin.jsp" id="login-form">
    <input type="text" placeholder="用户名" id="name" name="name" required>
    <input type="password" id="password" name="password" placeholder="密码" required>
    <img id="captcha-image" src="jcaptcha"/>
    <input type="text" id="jcaptcha" name="jcaptcha" required>
    <input type="checkbox" id="remember" name="remember_me" checked>
    <button type="submit" class="submit-bt">登录</button>
</form>
<p id="errorInfo" style="color:red"></p>
<script src="js/jquery-1.12.3.js"></script>
<script src="js/login.js"></script>
</body>
</html>
