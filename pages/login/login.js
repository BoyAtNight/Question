layui.use(['layer'], function() {
    var layer = layui.layer,
        $ = layui.$;

    // 注册或登录选项点击事件
    $('#register').click(function() {
        $('.logo_box')[0].reset();
        if ($('#register').text() == '注册') {
            $('#register').text('登录');
            $('#register').parent().find('label').hide();
            $('.button').text('注册');
        } else {
            $('#register').text('注册');
            $('#register').parent().find('label').show();
            $('.button').text('登录');
        }
    })

    // 点击登录/注册按钮
    $('#large-header button').click(function() {
        login();
    })

    // 回车键登录/注册
    document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) { // enter 键
            login();
        }
    };

    // 登录/注册校验
    function login() {
        if ($("#userName").val() == null || $("#userName").val() == '') {
            layer.msg("用户名不能为空", {
                icon: 2,
                time: 1000
            });
            return;
        }
        if ($('.button').text() == '注册') {
            const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
            if (!reg.test($('#userName').val())) {
                layer.msg("用户名为6至20位字母数据组合", {
                    icon: 2,
                    time: 2000
                });
                return;
            }
        }
        if ($("#password").val() == null || $("#password").val() == '') {
            layer.msg("密码不能为空", {
                icon: 2,
                time: 1000
            });
            return;
        }
        if ($('.button').text() == '登录') {
            // submit('', '', false);
        } else {
            // submit('', '', true);
        }
        window.sessionStorage.setItem('userInfo', 1);
        window.location.href = "../../index.html";
    }

    // 登录/注册
    function submit(url, data, isRegister) {
        $.ajax({
            url: url,
            type: "post",
            data: data,
            success: function(data) {
                if (data.errcode == 0) {
                    if (isRegister) { // 注册
                        layer.msg('注册成功，请用新账号登录', {
                            icon: 1,
                            time: 1500
                        });
                        $('#register').click();
                    } else { // 登录
                        if ($('#saveAccount')[0].checked) { // 记住密码
                            window.localStorage.setItem('userInfo', data.result)
                        } else {
                            window.sessionStorage.setItem('userInfo', data.result);
                        }
                        window.location.href = "../../index.html";
                    }
                } else {
                    layer.msg(data.errmsg);
                }
            }
        });
    }
})