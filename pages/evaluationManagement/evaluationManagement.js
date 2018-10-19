layui.use(['layer', 'form', 'laypage', 'laydate'], function () {
    var layer = layui.layer,
        form = layui.form,
        laydate = layui.laydate,
        laypage = layui.laypage;
    form.render();

    renderTable([1, 2]);
    initLaypage(85, 1)

    // 列表渲染
    function renderTable(data) {
        let html = '';
        data.forEach(item => {
            html += `<tr>
                        <td></td>
                        <td>1018.10.18 12:32:32</td>
                        <td title="${''}"><span>${''}</span></td>
                        <td>
                            <button class="layui-btn layui-btn-primary layui-btn-sm edit" data-id="1">查看</button>`;
            let userInfo = window.localStorage.getItem('userInfo') || window.sessionStorage.getItem('userInfo');
            if (userInfo == '1'/* 是否管理员 */) {
                html += `<button class="layui-btn layui-btn-primary layui-btn-sm delete" data-id="2">删除</button>`;
            }
            html += '</td></tr>';
        });
        if (html == '') {
            html = `<tr><td colspan="4" style="text-align:center">暂无数据</td></tr>`;
        }
        $('#evaluation').html(html);
    }

    // 分页初始化
    function initLaypage(totalCount, index) {
        laypage.render({
            elem: 'pagination',
            count: totalCount, // 数据总数，从服务端得到
            curr: index,
            layout: ['count', 'prev', 'page', 'next'],
            jump: function (obj, first) {
                if (!first) {   // 首次不执行
                    // obj.curr：得到当前页，以便向服务端请求对应页的数据。
                }
            }
        });
    }

    // 条件搜索
    form.on('submit(evaluationSearch)', function (data) {
        console.log(data.field);
        return false;
    })

    // 新增评价
    $('#add').click(function () {
        layer.prompt({
            formType: 2,
            title: '新增-评价'
        }, function (value, index, elem) {
            console.log(value); //得到value
            layer.close(index);
        });
    })

    // 编辑评价
    $('#evaluation .edit').click(function () {
        let currValue = $(this).parent().parent().find('td').eq(0).text();
        layer.prompt({
            formType: 2,
            title: '查看-评价',
            value: currValue || ' ',
            btn: ['确定'],
            success: function (layero, index) {
                console.log($(layero).find('.layui-layer-input'));
                $(layero).find('.layui-layer-input').attr('disabled', '').css('background', '#fff');
            }
        }, function (value, index, elem) {
            layer.close(index);
        });
    })

    // 删除评价
    $('#evaluation .delete').click(function () {
        let id = $(this).attr('data-id');
        layer.confirm('确定删除该评价?', { icon: 3, title: '提示' }, function (index) {
            //do something

            layer.close(index);
        });
    })

    // 日期初始化
    laydate.render({
        elem: '#createTime',
        type: 'datetime',
        range: '~',
        format: 'yyyy.MM.dd HH:mm:ss',
        max: new Date().getTime()
    });
})