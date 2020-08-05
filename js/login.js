

$(document).ready(function(){

    $("#login-form").submit(function(event){
        //不执行与事件关联的默认动作
        event.preventDefault();
        var $form = $(this);
        var rememberMe = $('#remember').prop('checked');
        var posting = $.getJSON("verify", {
            name: $('#name').val(),
            password: $('#password').val(),
            captcha: $('#jcaptcha').val(),
            remember: rememberMe
        });
        posting.done(function(data){
            if(data.state == 1) {
                document.getElementById("errorInfo").innerHTML = data.info;
                window.location.href="dashboard.html";
            }else if(data.state == 2) {
                document.getElementById("captcha-image").src = "jcaptcha";
                document.getElementById("errorInfo").innerHTML = data.info;
            }else if(data.state == 3) {
                document.getElementById("captcha-image").src = "jcaptcha";
                document.getElementById("errorInfo").innerHTML = data.info;
            }
        });
    });
    $("#captcha-image").click(function () {
        document.getElementById("captcha-image").src = "jcaptcha";
    })
});

