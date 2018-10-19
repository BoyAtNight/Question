layui.use(['layer', 'form', 'laypage', 'laydate'], function () {
    var layer = layui.layer,
        form = layui.form,
        laydate = layui.laydate,
        laypage = layui.laypage;
    form.render();

    // 获取搜索条件中的问卷类型
    $(function () {
        // 获取数据
        let category = [{ label: 1, value: '1美食' }, { label: 2, value: '2娱乐' }, { label: 3, value: '3科技' }];
        let html = '<option value=""></option>';
        category.forEach(item => {
            html += `<option value="${item.label}">${item.value}</option>`;
        });
        $('#question_type').html(html);
        form.render('select');
    })

    renderTable([1, 2, 3, 4]);
    initLaypage(85, 1)

    // 列表渲染
    function renderTable(data) {
        let html = '';
        data.forEach(item => {
            html += `<tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td title="${''}"><span>${''}</span></td>
                        <td>
                            <button class="layui-btn layui-btn-primary layui-btn-sm delete" data-id="2">删除</button>
                        </td>
                    </tr>`;
        });
        if (html == '') {
            html = `<tr><td colspan="7" style="text-align:center">暂无数据</td></tr>`;
        }
        $('#admin').html(html);
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
    form.on('submit(adminSearch)', function (data) {
        console.log(data.field);
        return false;
    })

    // 删除问卷
    $('#admin .delete').click(function () {
        let id = $(this).attr('data-id');
        layer.confirm('确定删除该问卷?', { icon: 3, title: '提示' }, function (index) {
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