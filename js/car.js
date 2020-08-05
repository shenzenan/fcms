var limit = 12;

$(document).ready(function () {

    var overview = $("#overview");
    var allCar = $("#all-car");
    var faultCar = $("#fault-car");
    var addCar = $("#add-car");
    var exportData = $("#export-data");
    var search = $("#search");
    var overviewPage = $("#overview-page");
    var allPage = $("#all-page");
    var faultPage = $("#fault-page");
    var searchPage = $("#search-page");
    var addPage = $("#add-page");



    //首页
    overview.click(function(){
        activeOnly(overview,overviewPage);
    });

    //搜索
    $('.search-panel .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#","");
        var concept = $(this).text();
        $('.search-panel span#search-concept').html(concept);
        $('.input-group #search-param').val(param);
    });
    search.click(function(){
        var maxPage = 0;
        activeOnly(overview,searchPage);
        overview.removeClass("active");

        var tbody = $("#search-tbody");
        var pagination = $("#search-pagination");

        var option = $('.input-group #search-param').val();
        var content = $('.input-group .form-control').val();

        var posting= $.getJSON("api/search",{
            type: "car",
            option: option,
            content: content,
            offset: 0,
            limit: limit
        });
        posting.done(function(data){
            if(data.state == 1){
                fillTable(tbody,data.cars);
                maxPage = Math.ceil(data.sum / limit);
                if(maxPage == 0){
                    maxPage = 1;
                }
                pagination.twbsPagination({
                    totalPages: maxPage,
                    visiblePages: 5,
                    initiateStartPageClick: false,
                    onPageClick: function (event, page) {
                        var postingTmp = $.getJSON("api/search", {
                            type: "car",
                            option: option,
                            content: content,
                            offset: (page - 1) * limit,
                            limit: limit
                        });
                        postingTmp.done(function (data) {
                            if(data.state == 1) {
                                fillTable(tbody, data.cars);
                            }else{
                                alertInfo("error","访问出错!");
                            }
                        });
                    }
                });
            }else{
                alertInfo("error","访问出错!");
            }
        });
    });

    var currentPage = 1;
    //显示所有车辆
    $("#all-car-table tbody").on("click","tr .delete-btn",function(event){
        var $row = jQuery(this).closest('tr');
        var $columns = $row.find('td');
        var value =  $columns.get(1).innerText;

        BootstrapDialog.show({
            title: '提示:',
            message: "确定删除车牌号为\"" + value + "\"的车?",
            buttons: [{
                label: '确定',
                action: function(dialog) {
                    dialog.close();

                    var posting = $.getJSON("api/car",{
                        query: "del",
                        licensePlate: value
                    });
                    posting.done(function(data){
                        alert(currentPage);
                        allCar.trigger("click");
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

    allCar.click(function(){
        var maxPage = 0;
        activeOnly(allCar,allPage);

        var tbody = $("#all-tbody");
        var pagination = $("#all-pagination");


        var posting = $.getJSON("api/car",{
            query: "pagination",
            offset: 0,
            limit: limit
        });

        posting.done(function(data){
            if(data.state == 1){
                fillTable(tbody,data.cars);
                maxPage = Math.ceil(data.sum / limit);
                pagination.twbsPagination({
                    startPage: currentPage,
                    totalPages: maxPage,
                    visiblePages: 5,
                    initiateStartPageClick: false,
                    onPageClick: function (event, page) {
                        currentPage = page;
                        var postingTmp = $.getJSON("api/car", {
                            query: "pagination",
                            offset: (page - 1) * limit,
                            limit: limit
                        });
                        postingTmp.done(function (data) {
                            if(data.state == 1) {
                                fillTable(tbody, data.cars);
                            }else{
                                alertInfo("error","访问出错!");
                            }
                        });
                    }
                });
            }else{
                alertInfo("error","访问出错!");
            }
        });
    });


    //显示故障车辆
    faultCar.click(function () {
        var offset = 0;
        var maxPage = 0;
        activeOnly(faultCar,faultPage);

        var tbody = $("#fault-tbody");
        var pagination = $("#fault-pagination");

        var posting = $.getJSON("api/car",{
            query: "fault",
            offset: offset,
            limit: limit
        });
        posting.done(function(data){
            if(data.state == 1){
                fillTable(tbody,data.cars);
                maxPage = Math.ceil(data.sum / limit);
                pagination.twbsPagination({
                    totalPages: maxPage,
                    visiblePages: 5,
                    initiateStartPageClick: false,
                    onPageClick: function (event, page) {
                        var postingTmp = $.getJSON("api/car", {
                            query: "fault",
                            offset: (page - 1) * limit,
                            limit: limit
                        });
                        postingTmp.done(function (data) {
                            fillTable(tbody,data.cars);
                        });
                    }
                });
            }else{
                alertInfo("error","访问出错!");
            }
        });
    });

    //添加车辆
    addCar.click(function(){
        activeOnly(addCar,addPage);

        $("#car-form").submit(function (event) {
            event.preventDefault();
            var data = {
                licensePlate: $("#license-plate").val(),
                trademark: $("#trademark").val(),
                seat: $("#seat").val(),
                registerDate: $("#register-date").val(),
                insuranceDate: $("#insurance-date").val(),
                vehicleLicense: $("#vehicle-license").val(),
                state: $("#state").val()
            };

            $.ajax({
                url: 'api/car',
                data: JSON.stringify(data),
                type: 'POST',
                contentType: 'application/json',
                success: function(data){
                    var dataObj = JSON.parse(data);
                    if(dataObj.state == 1){
                        alertInfo("success",dataObj.info);
                    }else if(dataObj.state == 2){
                        alertInfo("warning",dataObj.info);
                    }else{
                        alertInfo("error",dataObj.info);
                    }
                }
            });
        });
    });

    //导出数据
    exportData.click(function(){
        //!!!!!!!!
        activeOnly(exportData,searchPage);
    });
});

/**
 * 传入Json数组,填充表格
 */
function fillTable(tbody,data) {
    tbody.find("tr").remove();
    //tbody.empty();
    $.each(data, function (index, element) {
        var tr = $('<tr/>').appendTo(tbody);
        if(element.state == 1){
            element.state = "正常运行";
        }else if(element.state == 0){
            element.state = "故障";
        }
        $.each(element, function (key, value) {
            tr.append('<td>' + value + '</td>');
        });
        tr.append('<td><a href="#">记录</a> | <a href="#">修改</a> | <a href="#" class="delete-btn">删除</a></td> ');
    });
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
    BootstrapDialog.show({
        type: formatType,
        size: BootstrapDialog.SIZE_SMALL,
        title: '提示:',
        message: info
    });
}

/*
    $('#export').click(function(){
        $.ajax({
            url: "download",
            success: function(){
                window.location = "Resources/tt.xls";
            }
        });
    });
    */
