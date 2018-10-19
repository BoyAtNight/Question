layui.use(['layer', 'form', 'upload'], function () {
    var layer = layui.layer,
        form = layui.form,
        upload = layui.upload;
    form.render();

    defaultValue(/* 账户信息 */{ account: "贤心", token: "管理员", sex: "3", });

    /**
     * 表单初始赋值
     *
     * @param {*} info 账户信息
     */
    function defaultValue(info) {
        form.val('accountForm', {
            account: info.account,
            token: info.token,
            name: info.name,
            mobile: info.mobile,
            address: info.address,
            sex: info.sex,
            age: info.age
        })
    }

    // 保存更改后的账号信息
    form.on('submit(saveAccount)', function (data) {
        console.log(data.field)
        return false;
    })

    // 点击取消按钮，取消账户信息编辑，重新展示账户信息
    $('#cancel').click(function () {
        defaultValue(/* 账户信息 */);
    })

    // 图片拖拽上传
    upload.render({
        elem: '#uploadImg',
        url: '/upload/',
        auto: false,
        bindAction: '#saveAccount',
        accept: 'images',
        acceptMime: 'image/jpg, image/png',
        size: 2000,
        choose: function (obj) {
            obj.preview(function (index, file, result) {
                $('#headUrl').attr('src', result);
                $('#uploadImg .tips').css('display', 'none');
            });
        },
        done: function (res) {
            if (res.code > 0) {
                return layer.msg('上传失败');
            }
        },
        error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#uploatTips');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-primary layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
})