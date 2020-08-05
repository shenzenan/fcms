
$(document).ready(function(){

    var shifts = $("#shifts");
    var add = $("#add");
    var auto = $("#auto");

    var shiftsPage = $("#shifts-page");
    var addPage = $("#add-page");
    var autoPage = $("#auto-page");

    var table = $("#all-shift-table").DataTable({
        "bProcessing": true,
        "bFilter": false,
        "sAjaxSource": "api/shift?operation=query",
        "sAjaxDataProp": "shifts",
        columns: [
            {"data": "shiftID"},
            {"data": "routeName"},
            {"data": "startTime"},
            {"data": "licensePlate"},
            {"data": "driverID"},
            {
                mRender: function (data, type, row) {
                    return '<a class="table-edit " data-toggle="modal" data-target="#pop-edit">修改</a> | <a class="table-delete">删除</a>'
                }
            }
        ],
        columnDefs: [
            {orderable: false, targets: -1}
        ],
        language: {
            "sProcessing": "处理中...",
            "sLengthMenu": "每页显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "没有相关数据",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        }
    });

    $('#all-shift-table tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );


    $("#all-shift-table tbody").on("click","tr .table-delete",function(){
        var $row = jQuery(this).closest('tr');
        var $columns = $row.find('td');
        var value =  $columns.get(0).innerText;

        BootstrapDialog.show({
            title: '提示:',
            message: "确定删除\"" + value + "\"线路?",
            type: BootstrapDialog.TYPE_DANGER,
            buttons: [{
                label: '确定',
                action: function(dialog) {
                    dialog.close();

                    var posting = $.getJSON("api/shift",{
                        operation: "delete",
                        id: value
                    });
                    posting.done(function(data){
                        if(data.state == 1) {
                            alertInfo("success",data.info);
                            //table.row('.selected').remove().draw(false);
                            //table.row($(this).parents('tr')).remove().draw();
                            //table.ajax.reload();
                        }else{
                            alertInfo("error",data.info);
                        }
                    });
                }
            }, {
                label: '取消',
                action: function(dialog) {
                    dialog.close();
                }
            }]
        });
    });


    $("#all-shift-table tbody").on("click","tr .table-edit",function(){
        var $row = jQuery(this).closest('tr');
        var $columns = $row.find('td');
        var value =  $columns.get(0).innerText;
        var route = $columns.get(1).innerText;
        var time = $columns.get(2).innerText;
        var lp = $columns.get(3).innerText;
        var driver = $columns.get(4).innerText;

        $("#mt").html('编辑: ' + route + '线路' + value + '号线');
        $.getJSON("api/car").done(function(data){
            var select = $("#license-plate-edit");
            select.find("option").remove();
            $.each(data.cars,function(index, element){
                select.append('<option>' + element.licensePlate + '</option>');
            });
            $("#license-plate-edit").val(lp);
        });
        $.getJSON("api/driver").done(function(data){
            var select = $("#driver-name-edit");
            select.find("option").remove();
            $.each(data.drivers,function(index, element){
                select.append('<option>' + element.name + '</option>');
            });
            console.log(driver);
            $("#driver-name-edit").val(driver);
        });
        $("#start-time-edit").val(time);
    });

    $("#shift-edit-form").submit(function(event){

    });

    shifts.click(function() {
        activeOnly(shifts,shiftsPage);
        if (table) {
            table.ajax.reload();
        }
    });

    add.click(function(){
        activeOnly(add,addPage);
        //有的时候没有加载的BUG
        $.getJSON("api/route").done(function(data){
            var select  = $("#route-name");
            select.find("option").remove();
            $.each(data.routes, function(index, element){
                select.append('<option>' + element.routeName+ '</option>');
            });
        });
        $.getJSON("api/car").done(function(data){
            var select = $("#license-plate");
            select.find("option").remove();
            $.each(data.cars,function(index, element){
                select.append('<option>' + element.licensePlate+ '</option>');
            })
        });
        $.getJSON("api/driver").done(function(data){
            var select = $("#driver-name");
            select.find("option").remove();
            $.each(data.drivers,function(index, element){
                select.append('<option value="'+ element.driverID +'">' + element.name + '</option>');
            })
        });
    });

    $("#shift-form").submit(function(event){
        event.preventDefault();
        var data = {
            shiftID: $("#shiftID").val(),
            licensePlate: $("#license-plate").val(),
            startTime: $("#start-time").val(),
            routeName: $("#route-name").val(),
            driverID: $("#driver-name").val()
        };

        $.ajax({
            url: 'api/shift',
            data: JSON.stringify(data),
            type: 'POST',
            contentType: 'application/json',
            success: function(data){
                var dataObj = JSON.parse(data);
                if(dataObj && dataObj.state == 1){
                    alertInfo("success",dataObj.info);
                }else if(dataObj && dataObj.state == 2){
                    alertInfo("warning",dataObj.info);
                }else{
                    alertInfo("error",dataObj.info);
                }
            }
        });
    });

    auto.click(function(){
        activeOnly(auto, autoPage);
    });

});

function alertInfo(type, info){
    var formatType;
    if(type == "success"){
        formatType = BootstrapDialog.TYPE_SUCCESS;
    }else if(type == "warning"){
        formatType = BootstrapDialog.TYPE_WARNING;
    }else if(type == "error"){
        formatType = BootstrapDialog.TYPE_DANGER;
    }else{
        formatType = BootstrapDialog.TYPE_DEFAULT;
    }
    var dialogInstance = new BootstrapDialog({
        type: formatType,
        size: BootstrapDialog.SIZE_SMALL,
        title: '提示:',
        message: info
    });

    dialogInstance.open();
    setTimeout(function(){dialogInstance.close()}, 1500);
}

function activeOnly(element, contentElement){
    var siblings = element.siblings();
    $.each(siblings, function(index, tmp1){
        tmp1.setAttribute("class","");
    });
    element.addClass("active");

    var contentSiblings = contentElement.siblings();
    $.each(contentSiblings, function(index, tmp2){
        tmp2.setAttribute("class","hidden");
    });
    contentElement.removeClass("hidden");
}
