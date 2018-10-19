layui.use(['form', 'laypage'], function () {
    var form = layui.form,
        laypage = layui.laypage;
    form.render();

    renderTable([]);
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
                        <td>
                            <button class="layui-btn layui-btn-primary layui-btn-sm delete" data-id="2">删除</button>
                        </td>
                    </tr>`;
        });
        if (html == '') {
            html = `<tr><td colspan="6" style="text-align:center">暂无数据</td></tr>`;
        }
        $('#statistical').html(html);
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

    // 删除问卷统计
    $('#statistical .delete').click(function () {
        let id = $(this).attr('data-id');
        layer.confirm('确定删除该条统计数据?', { icon: 3, title: '提示' }, function (index) {
            //do something

            layer.close(index);
        });
    })

    // 条件搜索
    form.on('submit(categorySearch)', function (data) {
        console.log(data.field);
        return false;
    })
})