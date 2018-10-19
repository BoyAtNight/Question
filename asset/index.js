layui.use(['element', 'layer', 'form'], function () {
    let element = layui.element,
        layer = layui.layer,
        form = layui.form;
    form.render();

    // layer全局配置
    layer.config({
        move: false,
        resize: false,
    });

    // 检测用户是否记住密码或登录账号，未记住或未登录跳转登录页，已记住或已登录加载菜单、首页等
    if (window.localStorage.getItem('userInfo') || window.sessionStorage.getItem('userInfo')) {
        let defaultUrl = '',
            html = '';
        let userInfo = window.sessionStorage.getItem('userInfo') || window.localStorage.getItem('userInfo');
        if (userInfo == '1') { // 管理员
            html += `<li class="layui-nav-item"><a href="javascript:;" name="./pages/questionManagement/adminQuestion/adminQuestion.html">问卷管理</a></li>
                    <li class="layui-nav-item"><a href="javascript:;" name="./pages/categoryManagement/categoryManagement.html">问卷分类管理</a></li>
                    <li class="layui-nav-item"><a href="javascript:;" name="./pages/templateManagement/templateManagement.html">问卷模板管理</a></li>
                    <li class="layui-nav-item"><a href="javascript:;" name="./pages/accountManagement/accountManagement.html">账号管理</a></li>`;
            // <li class="layui-nav-item"><a href="javascript:;" name="./pages/questionManagement/createQuestion/createQuestion.html">创建问卷</a></li>
            defaultUrl = './pages/questionManagement/adminQuestion/adminQuestion.html';
        } else { // 普通用户
            html += `<li class="layui-nav-item"><a href="javascript:;" name="./pages/questionManagement/userQuestion/userQuestion.html">问卷管理</a></li>
                    <li class="layui-nav-item"><a href="javascript:;" name="./pages/questionStatistical/questionStatistical.html">问卷统计</a></li>
                    <li class="layui-nav-item"><a href="javascript:;" name="./pages/evaluationManagement/evaluationManagement.html">问卷评价</a></li>
                    <li class="layui-nav-item"><a href="javascript:;" name="./pages/accountManagement/accountManagement.html">账号管理</a></li>`;
            defaultUrl = './pages/questionManagement/userQuestion/userQuestion.html';
        }
        $('#nav').html(html);
        element.render('nav');

        // 加载首页
        if (url = window.sessionStorage.getItem('url')) {
            $(`a[name='${url}']`).parent('li').addClass('layui-this');
            loadNewPage(url);
        } else {
            window.sessionStorage.setItem('url', defaultUrl);
            $(`a[name='${defaultUrl}']`).parent('li').addClass('layui-this');
            loadNewPage(defaultUrl);
        }
    } else {
        window.location.href = '../pages/login/login.html';
    }

    // 监听导航点击
    element.on('nav(nav)', function (elem) {
        if (window.sessionStorage.getItem('url') != $(elem[0]).attr('name')) {
            window.sessionStorage.setItem('url', $(elem[0]).attr('name'));
            loadNewPage($(elem[0]).attr('name'));
        }
        window.sessionStorage.getItem('qId') && window.sessionStorage.removeItem('qId');
    });

    /**
     * 页面切换
     *
     * @param {*} url 页面路径
     */
    function loadNewPage(url) {
        $.ajaxSetup({
            cache: false
        });
        // 加载页面
        $('#myContent').load(url);
    }

    // 点击修改密码按钮，弹出修改密码弹框
    $('#change').click(function () {
        layer.open({
            type: 1,
            title: '修改密码',
            area: '500px',
            content: $('#changeModal'),
            success: function (layero) {
                var mask = $(".layui-layer-shade");
                mask.appendTo(layero.parent());
            },
            end: function () {
                $('#changeModal form')[0].reset();
            }
        });
    })

    // 保存修改的密码
    form.on('submit(saveForm)', function (data) {
        // data.field：当前容器的全部表单字段，名值对形式：{name: value}
        $.ajax({
            url: '',
            type: "post",
            data: data.field,
            success: function (data) {
                if (data.errcode == 0) {
                    layer.closeAll();
                    layer.msg('修改密码成功，请重新登录', {
                        icon: 1,
                        time: 1000
                    }, function () {
                        logout();
                    });
                } else {
                    layer.msg(data.errmsg);
                }
            }
        });
        return false; //阻止表单跳转。
    });

    // 点击退出按钮，退出账号
    $('#logout').click(function () {
        logout();
    })

    // 清除缓存，重新登录
    function logout() {
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.href = '../index.html';
    }

    // 修改密码弹框新密码校验
    form.verify({
        password: function (value, item) {
            if (!new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$").test(value)) {
                return '用户名为6至20位字母数据组合';
            }
        }
    });
});