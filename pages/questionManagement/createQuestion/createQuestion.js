layui.use(['layer', 'form'], function () {
    let layer = layui.layer,
        form = layui.form,
        userInfo = window.localStorage.getItem('userInfo') || window.sessionStorage.getItem('userInfo'),
        subjectCount = 0,   // 题目数量
        subjectInfo = null;   // 问卷标题、类型等信息
    form.render();

    $(function () {
        if (userInfo == '1'/* 是否管理员 */) {
            $(`a[name='./pages/templateManagement/templateManagement.html']`).parent('li').addClass('layui-this');
        } else {
            $(`a[name='./pages/questionManagement/userQuestion/userQuestion.html']`).parent('li').addClass('layui-this');
        }
    })

    // 点击题型按钮，创建相应题目模型
    $('.buttonGroup').on('click', '.add_Subject', function () {
        createQuestion($(this).attr('data-type'));
        $('#myContent').animate({ scrollTop: $('#content').height() + 95 }, 500); // 滚动到底部
    })

    // 删除对应题目
    $('#content').on('click', '.del_subject', function () {
        // data-delSubId：题型
        let delSubId = Number($(this).attr('data-delSubId'));
        let nodeList = $(this).parent().parent().find('.layui-form-item');
        if (nodeList.length > 1) {
            for (let i = delSubId; i < nodeList.length; i++) {
                // 序号
                $(nodeList[i]).find('label').text(delSubId + '.');
                // 题目
                let name = $(nodeList[i]).find('.item>input').attr('name').split('_');
                $(nodeList[i]).find('.item>input').attr('name', `${name[0]}_${delSubId}`);
                // 选项
                let optionList = $(nodeList[i]).find('.options input[type=text]');
                for (let j = 0; j < optionList.length; j++) {
                    let oName = $(optionList[j]).attr('name');
                    if (oName) {
                        oName = oName.split('_');
                        $(optionList[j]).attr('name', `${oName[0]}_${delSubId}_${oName[2]}`);
                    }
                }
                // 添加选项按钮
                let node = $(nodeList[i]).find('.optionButton button');
                if (node.length > 0) {
                    let addOpId = node.attr('data-addOpId').split('-');
                    $(nodeList[i]).find('.optionButton>button').attr('data-addOpId', `${addOpId[0]}_${delSubId}_${addOpId[2]}`);
                }
                // 删除题目按钮
                $(nodeList[i]).find('>button').attr('data-delSubId', delSubId++);
            }
            $(this).parent().remove();
            subjectCount--;
        } else {
            layer.msg('问卷题目不少于一个！');
        }
    })

    // 添加对应题目选项
    $('#content').on('click', '.add_option', function () {
        // data-addOpId：题型-题号-选项数量
        let html = '', addOpId = $(this).attr('data-addOpId').split('-');
        // name：radio_题号_选项号   data-delOpId：当前选项号
        if (addOpId[0] == 'radio') {
            html += `<div class="options">
                        <input type="radio">
                        <input type="text" name="radio_${addOpId[1]}_${Number(addOpId[2]) + 1}" class="layui-input" lay-verify="required" placeholder="请输入选项">
                        <button type="button" class="layui-btn layui-btn-primary layui-btn-xs del_option" data-delOpId="${Number(addOpId[2]) + 1}">删除</button>
                    </div>`;
        } else if (addOpId[0] == 'checkbox') {
            html += `<div class="options">
                        <input type="checkbox" lay-skin="primary">
                        <input type="text" name="checkbox_${addOpId[1]}_${Number(addOpId[2]) + 1}" class="layui-input" lay-verify="required" placeholder="请输入选项">
                        <button type="button" class="layui-btn layui-btn-primary layui-btn-xs del_option" data-delOpId="${Number(addOpId[2]) + 1}">删除</button>
                    </div>`;
        }
        $(this).attr('data-addOpId', `${addOpId[0]}-${addOpId[1]}-${Number(addOpId[2]) + 1}`);
        $(this).parent().before(html);
        form.render();
    })

    // 删除对应题目选项
    $('#content').on('click', '.del_option', function () {
        // data-delOpId：当前选项号
        let delOpId = Number($(this).attr('data-delOpId'));
        let addOpId = $(this).parent().parent().find('.optionButton>button').attr('data-addOpId').split('-');
        let nodeList = $(this).parent().parent().find('.options');
        if (nodeList.length > 2) {
            for (let i = delOpId; i < nodeList.length; i++) {
                let name = $(nodeList[i]).find('input[type=text]').attr('name').split('_');
                $(nodeList[i]).find('input[type=text]').attr('name', `${name[0]}_${name[1]}_${delOpId}`);
                $(nodeList[i]).find('button').attr('data-delOpId', delOpId++);
            }
            $(this).parent().parent().find('.optionButton button').attr('data-addOpId', `${addOpId[0]}-${addOpId[1]}-${Number(addOpId[2]) - 1}`);
            $(this).parent().remove();
        } else {
            layer.msg('选项不少于两个！');
        }
    })

    /**
     * 创建题目模型
     *
     * @param {*} temp 题型(1：单选，2：多选，3：填空)
     */
    function createQuestion(temp) {
        let html = '';
        switch (temp) {
            case 'radio':
                // name：radio_题号_选项号   data-delOpId：当前选项号
                // data-addOpId：题型-题号-选项数量
                // data-delSubId：题号
                html += `<div class="layui-form-item">
                            <label class="layui-form-label">${++subjectCount}.</label>
                            <div class="item">
                                <input type="text" name="radio_${subjectCount}" class="layui-input" lay-verify="required" placeholder="请输入题目">
                                <div class="options">
                                    <input type="radio">
                                    <input type="text" name="radio_${subjectCount}_1" class="layui-input" lay-verify="required" placeholder="请输入选项">
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs del_option" data-delOpId="1">删除</button>
                                </div>
                                <div class="options">
                                    <input type="radio">
                                    <input type="text" name="radio_${subjectCount}_2" class="layui-input" lay-verify="required" placeholder="请输入选项">
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs del_option" data-delOpId="2">删除</button>
                                </div>
                                <div class="optionButton">
                                    <button type="button" class="layui-btn layui-btn-xs add_option" data-addOpId="radio-${subjectCount}-2">添加选项</button>
                                </div>
                            </div>
                            <button type="button" class="layui-btn layui-btn-primary layui-btn-xs del_subject" data-delSubId="${subjectCount}">删除题目</button>
                        </div>`;
                break;
            case 'checkbox':
                // name：checkbox_题号_选项号   data-delOpId：当前选项号
                // data-addOpId：题型-题号-选项数量
                // data-delSubId：题号
                html += `<div class="layui-form-item">
                            <label class="layui-form-label">${++subjectCount}.</label>
                            <div class="item">
                                <input type="text" name="checkbox_${subjectCount}" class="layui-input" lay-verify="required" placeholder="请输入题目">
                                <div class="options">
                                    <input type="checkbox" lay-skin="primary">
                                    <input type="text" name="checkbox_${subjectCount}_1" class="layui-input" lay-verify="required" placeholder="请输入选项">
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs del_option" data-delOpId="1">删除</button>
                                </div>
                                <div class="options">
                                    <input type="checkbox" lay-skin="primary">
                                    <input type="text" name="checkbox_${subjectCount}_2" class="layui-input" lay-verify="required" placeholder="请输入选项">
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-xs del_option" data-delOpId="2">删除</button>
                                </div>
                                <div class="optionButton">
                                    <button type="button" class="layui-btn layui-btn-xs add_option" data-addOpId="checkbox-${subjectCount}-2">添加选项</button>
                                </div>
                            </div>
                            <button type="button" class="layui-btn layui-btn-primary layui-btn-xs del_subject" data-delSubId="${subjectCount}">删除题目</button>
                        </div>`;
                break;
            case 'input':
                // data-delSubId：题号
                html += `<div class="layui-form-item">
                            <label class="layui-form-label">${++subjectCount}.</label>
                            <div class="item">
                                <input type="text" name="input_${subjectCount}" class="layui-input" lay-verify="required" placeholder="请输入题目">
                                <div class="options">
                                    <input type="text" class="layui-input inputBorder" readonly>
                                </div>
                            </div>
                            <button type="button" class="layui-btn layui-btn-primary layui-btn-xs del_subject" data-delSubId="${subjectCount}">删除题目</button>
                        </div>`;
                break;

        }
        $('#content').append(html);
        form.render();
    }

    // 点击生成问卷按钮，保存问卷信息
    $('#submit').click(function () {console.log(12313, $('#subTitle>button'), $('#content>button'))
        $('#subTitle>button').click();
        $('#content>button').click();
    });
    // 问卷信息
    form.on('submit(saveTitle)', function (data) {
        subjectInfo = {
            question_des: data.field.question_des,
            question_title: data.field.question_title,
            question_type_id: data.field.question_type_id,
            status: data.field.status,
            create_id: null
        }
        return false;
    });
    // 题目信息
    form.on('submit(saveForm)', function (data) {
        // data.field：当前容器的全部表单字段，名值对形式：{name: value}
        if (JSON.stringify(data.field) === '{}') {
            layer.msg('请选择题型并创建题目');
            return false;
        };
        let subjectOption = [];
        for (const key in data.field) {
            let sub = key.split('_');
            if (subjectOption[sub[1] - 1]) {
                subjectOption[sub[1] - 1].option_content == null ? subjectOption[sub[1] - 1].option_content = data.field[key] : subjectOption[sub[1] - 1].option_content += '#' + data.field[key];
            } else {
                subjectOption[sub[1] - 1] = {
                    question_content: data.field[key],
                    option_content: null,
                    question_type: sub[0] == 'radio' ? 1 : sub[0] == 'checkbox' ? 2 : 3
                };
            }
        }
        console.log(subjectInfo, subjectOption);
        /* 
            subjectInfo对象内容如下
            {   create_id: null
                question_des: "花木成畦手自栽花木成畦手自栽"
                question_title: "啊打发撒旦"
                question_type_id: "1"
                status: "1"
            }

            subjectOption数组内容如下，题目序号为下标+1
            [   {question_content: "1", option_content: "2#3#4", question_type: 1}
                {question_content: "5", option_content: "6#7#8#9", question_type: 2}
                {question_content: "0", option_content: "", question_type: 3}
            ]
        */

        // $.ajax({
        //     url: '',
        //     type: "post",
        //     data: null,
        //     success: function(data) {
        //         if (data.errcode == 0) {
        //             
        //         } else {
        //             layer.msg(data.errmsg);
        //         }
        //     }
        // });
        return false; //阻止表单跳转。
    });

    // 返回上一页
    $('#back').click(function () {
        let userInfo = window.localStorage.getItem('userInfo') || window.sessionStorage.getItem('userInfo'), url = '';
        if (userInfo == '1'/* 是否管理员 */) {
            url = './pages/templateManagement/templateManagement.html';
        } else {
            url = './pages/questionManagement/userQuestion/userQuestion.html';
        }
        window.sessionStorage.setItem('url', url);
        $.ajaxSetup({
            cache: false
        });
        $('#myContent').load(url);
    })
});