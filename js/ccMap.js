/**
 * Created by yisic on 2016/7/9.
 */


function Car(id, maxPassengerNum) {
    this.id = id;
    this.maxPassengerNum = maxPassengerNum;
}

function Station(ccMap, stationName, stationPoint, stationId) {
    this.stationId = stationId;
    this.ccMap = ccMap;
    this.marker = new BMap.Marker(stationPoint);
    this.marker.setTitle(stationName);
    this.marker.addEventListener("click", ccMap.event_marker_click);
    this.marker.enableDragging();
    var newStation = this;
    var newMarker = this.marker;
    this.marker.infoWindow = new BMap.InfoWindow(
        '<input type="text" id="name" value=' + newStation.marker.getTitle() + '><p>' + newStation.marker.getPosition().lng + '</p><p>' + newStation.marker.getPosition().lat + '</p>', {
            width: 250,
            height: 100,
            title: ""
        });
    this.marker.infoWindow.addEventListener("open", function (e) {
        e.target.setContent('<input type="text" id="name" value=' + newMarker.getTitle() + '><p>' + newMarker.getPosition().lng + '</p><p>' + newMarker.getPosition().lat + '</p>');
    });
    this.marker.infoWindow.addEventListener("close", function (e) {
        newStation.setName(document.getElementById('name').value);
    });
    var newMenu = new BMap.ContextMenu();
    newMenu.addItem(new BMap.MenuItem('删除', function () {
        if (ccMap.mode == "stationSetting") {
            ccMap.deleteStationByStation(newStation);
        }
        else if (ccMap.mode == "lineSetting") {
            if (ccMap.currentLine)
                ccMap.currentLine.deleteStationFromLineByStation(newStation);
            else
                alert("请到站点模式删除站点");
        }
    }));
    newStation.marker.addContextMenu(newMenu);
    this.stationElement = this.ccMap.menuManager.createStationElement(this);
    this.marker.station = this;

    ccMap.mainMap.addOverlay(this.marker);
}
Station.prototype = {
    stationId: null,
    stationElement: null,
    setName: function (newName) {
        this.marker.setTitle(newName);
        this.ccMap.menuManager.renameStationElement(this, newName);
    },
    getName: function () {
        return this.marker.getTitle();
    },
    destroy: function () {
        this.ccMap.menuManager.deleteStationElement(this);
        this.ccMap.mainMap.removeOverlay(this.marker);
    }
};

function LineData(line) {
    this.lineName = line.lineName;
    this.lineNodeList = [];
    for (var i = 0; i < line.lineNodeList.length; i++)
        this.lineNodeList.push(line.lineNodeList[i]);
}
function Line(ccMap, lineName, lineId) {
    this.lineId = lineId;
    this.lineNodeList = [];
    this.ccMap = ccMap;
    this.lineName = lineName;
    this.drivingRoute = new BMap.DrivingRoute(ccMap.mainMap, {
        renderOptions: {
            map: ccMap.mainMap,
            autoViewport: false,
            enableDragging: false
        }
    });
    this.drivingRoute.setMarkersSetCallback(this.markerSetCallBack);
    this.lineElement = this.ccMap.menuManager.createLineElement(this);
}
Line.prototype = {
    lineElement: null,
    lineAlterTemp: null,
    getName: function () {
        return this.lineName;
    },
    setName: function (newName) {
        this.lineName = newName;
    },
    addStationIntoLine: function (station) {
        for (var i = 0; i < this.lineNodeList.length; i++)
            if (this.lineNodeList[i] == station) {
                alert("此站已在线路中");
                return;
            }
        this.lineNodeList.push(station);
        this.updateIcon();
        // this.drivingRoute.clearResults();
        // if (this.lineNodeList.length >= 2)
        //     this.drawDrivingRoute();
        this.ccMap.menuManager.addStationElementIntoLineElement(this, station);
    },
    deleteStationFromLineByStation: function (stationForDelete) {
        this.ccMap.menuManager.deleteStationElementFromLineElement(this, stationForDelete);
        for (var i = 0; i < this.lineNodeList.length; i++)
            if (this.lineNodeList[i] == stationForDelete) {
                for (var j = i; j < this.lineNodeList.length - 1; j++)
                    this.lineNodeList[j] = this.lineNodeList[j + 1];
                this.lineNodeList.pop();
                stationForDelete.marker.setIcon(new BMap.Icon("http://api0.map.bdimg.com/images/marker_red_sprite.png", new BMap.Size(23, 23)));//TODO 重置该站点(需要合适的icon)
                this.updateIcon();
                if (this.lineNodeList.length < 2)
                    this.drivingRoute.clearResults();
                else if (this.ccMap.currentLine == this)
                    this.drawDrivingRoute();
            }
        // this.ccMap.menuManager.deleteStationElementFromLineElement(this, stationForDelete);
    },
    deleteStationFromLineByIndex: function (deleteIndex) {
        if (deleteIndex < 0 || deleteIndex > this.lineNodeList.length - 1)
            return;
        var stationForDelete = this.lineNodeList[deleteIndex];
        for (var i = deleteIndex; i < this.lineNodeList.length - 1; i++)
            this.lineNodeList[i] = this.lineNodeList[i + 1];
        this.lineNodeList.pop();
        stationForDelete.marker.setIcon(new BMap.Icon("http://api0.map.bdimg.com/images/marker_red_sprite.png", new BMap.Size(11, 6)));//TODO 重置该站点(需要合适的icon)
        this.updateIcon();
        if (this.lineNodeList.length < 2)
            this.drivingRoute.clearResults();
        else
            this.drawDrivingRoute();
    },
    addNewOrder: function () {

    },
    updateIcon: function () {
        if (this.ccMap.currentLine != this)
            return;
        for (var i = 0; i < this.lineNodeList.length; i++) {
            if (i == 0)
                this.lineNodeList[i].marker.setIcon(new BMap.Icon("resource/map/start.png", new BMap.Size(23, 36)));
            else if (i == this.lineNodeList.length - 1)
                this.lineNodeList[i].marker.setIcon(new BMap.Icon("resource/map/end.png", new BMap.Size(23, 23)));
            else
                this.lineNodeList[i].marker.setIcon(new BMap.Icon("resource/map/mid.png", new BMap.Size(23, 36)));
        }
    },
    swapStation: function (index1, index2) {
        if ((index1 < 0 || index1 > this.lineNodeList.length - 1) || (index2 < 0 || index2 > this.lineNodeList.length - 1)) {
            alert("不可移动!");
            return;
        }
        var temp = this.lineNodeList[index1];
        this.lineNodeList[index1] = this.lineNodeList[index2];
        this.lineNodeList[index2] = temp;
        this.updateIcon();
        this.drawDrivingRoute();
        this.ccMap.menuManager.swapLineStationElement(this, index1, index2);
    },
    drawDrivingRoute: function () {
        this.updateIcon();
        if (this.lineNodeList.length < 2) {
            this.clearDrivingRoute();
            return;
        }
        var pathPoints = [];
        for (var i = 1; i < this.lineNodeList.length - 1; i++) {
            pathPoints.push(this.lineNodeList[i].marker.getPosition());
        }
        var startPoint = this.lineNodeList[0].marker.getPosition();
        var endPoint = this.lineNodeList[this.lineNodeList.length - 1].marker.getPosition();
        this.drivingRoute.clearResults();
        this.drivingRoute.search(startPoint, endPoint, {
            waypoints: pathPoints
        });
    },
    clearDrivingRoute: function () {
        for (var i = 0; i < this.lineNodeList.length; i++)
            this.lineNodeList[i].marker.setIcon(new BMap.Icon("http://api0.map.bdimg.com/images/marker_red_sprite.png", new BMap.Size(23, 23)));
        this.drivingRoute.clearResults();
    },
    markerSetCallBack: function (pois) {
        pois[0].marker.hide();
        pois[pois.length - 1].marker.hide();
        for (var i = 1; i < pois.length - 1; i++)
            pois[i].Lm.hide();
    },
    startAlter: function () {
        this.lineAlterTemp = new LineData(this);
        this.drawDrivingRoute();
    },
    endAlterAndSave: function () {
        this.lineAlterTemp = null;
        this.clearDrivingRoute();
    },
    endAlterAndCancel: function () {
        this.clearDrivingRoute();
        this.lineName = this.lineAlterTemp.lineName;
        this.lineNodeList = this.lineAlterTemp.lineNodeList;
    },
    destroy: function () {
        this.ccMap.menuManager.deleteLineElement(this);
    }
};

function MenuManager(ccMap, menuDivName) {
    this.ccMap = ccMap;
    this.menuDiv = document.getElementById(menuDivName);
    this.menuDiv.className = "ccMapMenu";
    this.stationMenuDiv = document.createElement("div");
    this.stationMenuDiv.style.display = "none";
    this.menuDiv.appendChild(this.stationMenuDiv);
    this.lineMenuDiv = document.createElement("div");
    this.lineMenuDiv.style.display = "none";
    this.menuDiv.appendChild(this.lineMenuDiv);
    this.stationListElement = document.createElement("ol");
    this.stationListElement.innerHTML = '<li><div class="liInfo">站点名</div> <div class="liOperations">操作</div></li>';
    this.stationListElement.style.listStyle = "none";
    this.stationMenuDiv.appendChild(this.stationListElement);
    this.lineListElement = document.createElement("ol");
    this.lineListElement.innerHTML = '<li><div class="liInfo">线路名</div> <div class="liOperations">操作</div></li>'
    this.lineMenuDiv.appendChild(this.lineListElement);
    var addNewLineLi = document.createElement("li");
    var addNewLineButton = document.createElement("input");
    addNewLineButton.type = "button";
    addNewLineButton.value = "添加新线路";
    addNewLineLi.appendChild(addNewLineButton);
    this.lineListElement.appendChild(addNewLineLi);

    addNewLineButton.addEventListener("click", function (e) {
        ccMap.createLine("新线路");
    });
}
MenuManager.prototype = {
    changeToStationMode: function () {
        this.stationMenuDiv.style.display = "";
        this.lineMenuDiv.style.display = "none";
    },
    changeToLineMode: function () {
        this.stationMenuDiv.style.display = "none";
        this.lineMenuDiv.style.display = "";
    },
    createStationElement: function (newStation) {
        var newStationElement = document.createElement("li");
        newStationElement.className = "liElement";
        this.stationListElement.appendChild(newStationElement);
        var newStationInfo = document.createElement("div");
        var newStationOperations = document.createElement("div");
        newStationElement.appendChild(newStationInfo);
        newStationElement.appendChild(newStationOperations);
        newStationInfo.className = "liInfo";
        newStationOperations.className = "liOperations";
        var newStationNamePrinter = document.createElement("div");
        var newStationNameTextField = document.createElement("input");
        newStationNamePrinter.innerHTML = newStation.getName();
        newStationNameTextField.type = "text";
        newStationNameTextField.style.display = "none";
        newStationInfo.appendChild(newStationNamePrinter);
        newStationInfo.appendChild(newStationNameTextField);
        var alterButton = document.createElement("input");
        alterButton.type = "button";
        alterButton.value = "修改";
        var searchButton = document.createElement("input");
        searchButton.type = "button";
        searchButton.style.display = "none";
        searchButton.value = "定位";
        var saveButton = document.createElement("input");
        saveButton.type = "button";
        saveButton.value = "保存";
        saveButton.style.display = "none";
        var cancelButton = document.createElement("input");
        cancelButton.type = "button";
        cancelButton.style.display = "none";
        cancelButton.value = "取消";
        var deleteButton = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.value = "删除";
        newStationOperations.appendChild(alterButton);
        newStationOperations.appendChild(searchButton);
        newStationOperations.appendChild(saveButton);
        newStationOperations.appendChild(cancelButton);
        newStationOperations.appendChild(deleteButton);
        searchButton.addEventListener("click", function () {
            new BMap.Geocoder().getLocation(new BMap.Point(newStation.marker.getPosition().lng, newStation.marker.getPosition().lat), function (rs) {
                newStationNameTextField.value = rs.addressComponents.street;
            });
        });
        alterButton.addEventListener("click", function () {
            newStationNameTextField.value = newStation.getName();
            newStationNamePrinter.style.display = "none";
            newStationNameTextField.style.display = "";
            alterButton.style.display = "none";
            searchButton.style.display = "";
            saveButton.style.display = "";
            cancelButton.style.display = "";
            deleteButton.style.display = "none";
        });
        saveButton.addEventListener("click", function () {
            newStation.setName(newStationNameTextField.value);
            newStationNamePrinter.innerHTML = newStation.getName();
            newStationNamePrinter.style.display = "";
            newStationNameTextField.style.display = "none";
            alterButton.style.display = "";
            searchButton.style.display = "none";
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            deleteButton.style.display = "";
        });
        cancelButton.addEventListener("click", function () {
            newStationNamePrinter.innerHTML = newStation.getName();
            newStationNamePrinter.style.display = "";
            newStationNameTextField.style.display = "none";
            alterButton.style.display = "";
            searchButton.style.display = "none";
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            deleteButton.style.display = "";
        });
        deleteButton.addEventListener("click", function () {
            newStation.ccMap.deleteStationByStation(newStation);
        });
        return newStationElement;
    },
    deleteStationElement: function (stationForDelete) {
        this.stationListElement.removeChild(stationForDelete.stationElement);
    },
    renameStationElement: function (station, newName) {
        station.stationElement.firstChild.firstChild.innerHTML = newName;
    },
    createLineElement: function (newLine) {
        var newLineElement = document.createElement("li");
        newLineElement.className = "liElement";
        this.lineListElement.insertBefore(newLineElement, this.lineListElement.childNodes[this.lineListElement.childNodes.length - 1]);
        var newLineHeadElement = document.createElement("div");
        var newLineStationListElement = document.createElement("ol");
        newLineStationListElement.style.display = "none";
        newLineElement.appendChild(newLineHeadElement);
        newLineElement.appendChild(newLineStationListElement);
        var newLineInfoElement = document.createElement("div");
        var newLineOperationsElement = document.createElement("div");
        newLineInfoElement.className = "liInfo";
        newLineOperationsElement.className = "liOperations";
        newLineHeadElement.appendChild(newLineInfoElement);
        newLineHeadElement.appendChild(newLineOperationsElement);
        var newLineNamePrinter = document.createElement("div");
        newLineNamePrinter.innerHTML = newLine.getName();
        var newLineNameTextField = document.createElement("input");
        newLineNameTextField.type = "text";
        newLineNameTextField.style.display = "none";
        newLineInfoElement.appendChild(newLineNamePrinter);
        newLineInfoElement.appendChild(newLineNameTextField);
        var alterLineButton = document.createElement("input");
        var saveLineButton = document.createElement("input");
        var cancelLineButton = document.createElement("input");
        var deleteLineButton = document.createElement("input");
        alterLineButton.type = "button";
        saveLineButton.type = "button";
        cancelLineButton.type = "button";
        deleteLineButton.type = "button";
        alterLineButton.value = "修改";
        saveLineButton.value = "保存";
        cancelLineButton.value = "取消";
        deleteLineButton.value = "删除";
        saveLineButton.style.display = "none";
        cancelLineButton.style.display = "none";
        newLineOperationsElement.appendChild(alterLineButton);
        newLineOperationsElement.appendChild(saveLineButton);
        newLineOperationsElement.appendChild(cancelLineButton);
        newLineOperationsElement.appendChild(deleteLineButton);
        alterLineButton.addEventListener("click", function () {
            if (newLine.ccMap.alterLineStart(newLine)) {
                newLineNameTextField.value = newLine.getName();
                newLineNamePrinter.style.display = "none";
                newLineNameTextField.style.display = "";
                newLineStationListElement.style.display = "";
                alterLineButton.style.display = "none";
                saveLineButton.style.display = "";
                cancelLineButton.style.display = "";
                deleteLineButton.style.display = "none";
            }
        });
        saveLineButton.addEventListener("click", function () {
            newLine.setName(newLineNameTextField.value);
            newLine.ccMap.alterLineEndAndSave();
            newLineNamePrinter.innerHTML = newLine.getName();
            newLineNamePrinter.style.display = "";
            newLineNameTextField.style.display = "none";
            newLineStationListElement.style.display = "none";
            alterLineButton.style.display = "";
            saveLineButton.style.display = "none";
            cancelLineButton.style.display = "none";
            deleteLineButton.style.display = "";
        });
        var referenceToMenuManager = this;
        cancelLineButton.addEventListener("click", function () {
            newLine.ccMap.alterLineEndAndCancel();
            var stationNum = newLineStationListElement.childNodes.length;
            for (var i = 0; i < stationNum; i++)
                newLineStationListElement.removeChild(newLineStationListElement.childNodes[0]);
            for (var i = 0; i < newLine.lineNodeList.length; i++)
                referenceToMenuManager.addStationElementIntoLineElement(newLine, newLine.lineNodeList[i]);
            newLineNameTextField.innerHTML = newLine.getName();
            newLineNamePrinter.style.display = "";
            newLineNameTextField.style.display = "none";
            newLineStationListElement.style.display = "none";
            alterLineButton.style.display = "";
            saveLineButton.style.display = "none";
            cancelLineButton.style.display = "none";
            deleteLineButton.style.display = "";
        });
        deleteLineButton.addEventListener("click", function () {
            newLine.ccMap.deleteLineByLine(newLine);
        });

        var addNewOrderLi = document.createElement("li");
        var addNewOrderButton = document.createElement("input");
        addNewOrderButton.type = "button";
        addNewOrderButton.value = "添加新班次";
        addNewOrderButton.addEventListener("click", newLine.addNewOrder);
        addNewOrderLi.appendChild(addNewOrderButton);
        return newLineElement;
    },
    deleteLineElement: function (lineForDelete) {
        this.lineListElement.removeChild(lineForDelete.lineElement);
    },
    addStationElementIntoLineElement: function (line, station) {
        var newLineStationListElement = line.lineElement.childNodes[1];
        var newLineStationLi = document.createElement("li");
        newLineStationListElement.appendChild(newLineStationLi);
        var newLineStationName = document.createElement("div");
        newLineStationName.innerHTML = station.getName();
        var newLineStationOperations = document.createElement("div");
        newLineStationLi.appendChild(newLineStationName);
        newLineStationLi.appendChild(newLineStationOperations);
        var upSwapButton = document.createElement("input");
        var downSwapButton = document.createElement("input");
        var deleteStationFromLineButton = document.createElement("input");
        upSwapButton.type = "button";
        upSwapButton.value = "上移";
        downSwapButton.type = "button";
        downSwapButton.value = "下移";
        deleteStationFromLineButton.type = "button";
        deleteStationFromLineButton.value = "删除";
        newLineStationOperations.appendChild(deleteStationFromLineButton);
        newLineStationOperations.appendChild(upSwapButton);
        newLineStationOperations.appendChild(downSwapButton);
        upSwapButton.addEventListener("click", function () {
            var i;
            for (i = 0; i < line.lineNodeList.length; i++)
                if (line.lineNodeList[i] == station)
                    break;
            line.swapStation(i, i - 1);
        });
        downSwapButton.addEventListener("click", function () {
            var i;
            for (i = 0; i < line.lineNodeList.length; i++)
                if (line.lineNodeList[i] == station)
                    break;
            line.swapStation(i, i + 1);
        });
        deleteStationFromLineButton.addEventListener("click", function () {
            line.deleteStationFromLineByStation(station);
        });
    },
    deleteStationElementFromLineElement: function (line, stationForDelete) {
        var i;
        for (i = 0; i < line.lineNodeList.length; i++)
            if (line.lineNodeList[i] == stationForDelete)
                break;
        line.lineElement.childNodes[1].removeChild(line.lineElement.childNodes[1].childNodes[i]);
    },
    swapLineStationElement: function (line, index1, index2) {
        var lineStationList = line.lineElement.childNodes[1];
        var station1 = lineStationList.childNodes[index1];
        var station2 = lineStationList.childNodes[index2];
        var temp = document.createElement("li");
        lineStationList.insertBefore(temp, station1);
        lineStationList.removeChild(station1);
        lineStationList.insertBefore(station1, station2);
        lineStationList.removeChild(station2);
        lineStationList.insertBefore(station2, temp);
        lineStationList.removeChild(temp);
    }
};

function CCMap(ccMapContainerDivName, menuDivName) {
    this.ccMapContainerDiv = document.getElementById(ccMapContainerDivName);
    this.mainMapDiv = document.createElement("div");
    this.mainMapDiv.id = "mainMap";
    this.menuDiv = document.createElement("div");
    this.ccMapContainerDiv.appendChild(this.mainMapDiv);
    this.ccMapContainerDiv.appendChild(this.menuDiv);
    this.mainMap = new BMap.Map(ccMapContainerDivName, {enableMapClick: false});
    this.mainMap.centerAndZoom("北京");
    this.mainMap.enableScrollWheelZoom(true);
    this.mainMap.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_SMALL}));
    this.mainMap.disableDoubleClickZoom();
    this.mainMap.addEventListener("dblclick", this.event_map_dbclick);
    this.mainMap.ccMap = this;

    this.menuManager = new MenuManager(this, menuDivName);
}
CCMap.prototype = {
    mode: null,
    employeePoints: [],
    employeePointsCollection: null,
    stationList: [],
    lineList: [],
    currentLine: null,
    //map
    search: function (str) {
        var ccMap = this;
        var local = new BMap.LocalSearch(this.mainMap, {
            renderOptions: {map: this.mainMap},
            onMarkersSet: function (pois) {
                for (var i = 0; i < pois.length; i++)
                    ccMap.mainMap.removeOverlay(pois[i].marker);
            }
        });
        local.search(str);
    },

    //event
    event_map_dbclick: function (e) {
        if (e.target.ccMap.mode == "stationSetting") {
            new BMap.Geocoder().getLocation(e.point, function (rs) {
                var stationName = rs.addressComponents.street;
                if (stationName == "")
                    stationName = "未命名";
                e.target.ccMap.createStation(stationName, e.point, null);
            });
        }
    },
    event_marker_click: function (e) {
        if (e.target.getMap().ccMap.mode == "stationSetting") {
            e.target.openInfoWindow(e.target.infoWindow);
        }
        else if (e.target.getMap().ccMap.mode == "lineSetting") {
            if (e.target.getMap().ccMap.currentLine)
                e.target.getMap().ccMap.addStationIntoCurrentLine(e.target.station);
        }
    },

    //mode
    changeMode: function (mode) {
        if (this.mode == mode)
            return;
        if (mode == "stationSetting") {//marker可拖拽，菜单切换，更改mode变量
            for (var i = 0; i < this.stationList.length; i++)
                this.stationList[i].marker.enableDragging();
            this.menuManager.changeToStationMode();
            this.mode = mode;
        }
        else if (mode == "lineSetting") {//marker不可拖拽，菜单切换，更改mode变量
            for (var j = 0; j < this.stationList.length; j++)
                this.stationList[j].marker.disableDragging();
            this.menuManager.changeToLineMode();
            this.mode = mode;
        }
        else
            alert("mode error!");
    },

    //employee
    loadEmployeePoints: function (addressPointsll) {
        this.employeePoints = addressPointsll;
    },
    employeePointIsPrinted: function () {
        if (!this.employeePointsCollection)
            return false;
        else
            return true;
    },
    printOrRemoveEmployeePoint: function () {
        if (document.createElement('canvas').getContext) {// 判断当前浏览器是否支持绘制海量点
            if (!this.employeePointsCollection) {
                var points = [];
                for (var i = 0; i < this.employeePoints.length; i++) {
                    points.push(new BMap.Point(this.employeePoints[i][0], this.employeePoints[i][1]));
                }
                this.employeePointsCollection = new BMap.PointCollection(points, {
                    size: BMAP_POINT_SIZE_SMALL,
                    shape: BMAP_POINT_SHAPE_STAR,
                    color: '#d340c3'
                });
                this.mainMap.addOverlay(this.employeePointsCollection);
            }
            else {
                this.mainMap.removeOverlay(this.employeePointsCollection);
                this.employeePointsCollection = null;
            }
        }
        else {
            alert('请在chrome、safari、IE8+以上浏览器绘制');
        }
    },

    //station
    createStation: function (stationName, stationPoint, stationId) {
        this.stationList.push(new Station(this, stationName, stationPoint, stationId));
    },
    loadStations: function (stationsData) {
        var stations = stationsData.stations;
        for (var i = 0; i < stationsData.sum; i++)
            this.createStation(stations[i].stationName, new BMap.Point(stations[i].longitude, stations[i].latitude), stations[i].stationID);
    },
    loadStations2: function (stationNameList, stationPointList) {
        if (stationNameList.length != stationPointList.length) {
            alert("站名列表和坐标列表表长不一致！");
            return;
        }
        for (var i = 0; i < stationNameList.length; i++)
            this.createStation(stationNameList[i], stationPointList[i]);
    },
    deleteStationByStation: function (stationForDelete) {
        var list = [];
        for (var i = 0; i < this.lineList.length; i++)
            for (var j = 0; j < this.lineList[i].lineNodeList.length; j++)
                if (this.lineList[i].lineNodeList[j] == stationForDelete) {
                    list.push(this.lineList[i]);
                    break;
                }
        if (list.length > 0) {
            var warnings = "此站点在";
            for (var i = 0; i < list.length; i++) {
                warnings += list[i].lineName;
                warnings += "线  "
            }
            warnings += "中存在,确定要删除？";
            if (confirm(warnings)) {
                for (var i = 0; i < list.length; i++)
                    list[i].deleteStationFromLineByStation(stationForDelete);
            }
            else
                return;
        }
        for (var i = 0; i < this.stationList.length; i++)
            if (this.stationList[i] == stationForDelete) {
                for (var j = i; j < this.stationList.length - 1; j++)
                    this.stationList[j] = this.stationList[j + 1];
                this.stationList.pop();
                break;
            }
        stationForDelete.destroy();
    },
    outputStations: function () {
        var stationData = {};
        stationData.sum = this.stationList.length;
        stationData.stations = [];
        var tempStation;
        for (var i = 0; i < this.stationList.length; i++) {
            tempStation = {};
            if (this.stationList[i].stationId)
                tempStation.stationID = this.stationList[i].stationId;
            else
                tempStation.stationID = -1;
            tempStation.stationName = this.stationList[i].getName();
            tempStation.longitude = this.stationList[i].marker.getPosition().lng;
            tempStation.latitude = this.stationList[i].marker.getPosition().lat;
            stationData.stations.push(tempStation);
        }
        return stationData;
    },

    //line
    createLine: function (lineName) {
        if (lineName == "")
            lineName = "新线路";
        this.lineList.push(new Line(this, lineName));
    },
    loadLines: function (linesData) {
        var lines = linesData.routes;
        for (var i = 0; i < linesData.sum; i++)
            this.createLine(lines[i].routeName);
    },
    loadLineStations: function (lineStationsData) {
        var lineStations = lineStationsData.routeStations;
        var line = null;
        var station = null;
        for (var i = 0; i < lineStationsData.sum; i++) {
            for (var j = 0; j < this.lineList.length; j++)
                if (this.lineList[j].getName() == lineStations[i].routeName) {
                    line = this.lineList[j]
                    break;
                }
            for (var k = 0; k < this.stationList.length; k++)
                if (this.stationList[k].stationId == lineStations[i].stationID) {
                    station = this.stationList[k];
                    break;
                }
            line.addStationIntoLine(station);
        }
        for (var i = 0; i < this.lineList.length; i++)
            this.lineList[i].clearDrivingRoute();
    },
    deleteLineByLine: function (lineForDelete) {
        for (var i = 0; i < this.lineList.length; i++)
            if (this.lineList[i] == lineForDelete) {
                for (var j = i; j < this.lineList.length - 1; j++)
                    this.lineList[j] = this.lineList[j + 1];
                this.lineList.pop();
                break;
            }
        lineForDelete.destroy();
    },
    alterLineStart: function (line) {
        if (this.currentLine) {
            alert("请先保存或取消当前正在修改的线路");
            return false;
        }
        else {
            this.currentLine = line;
            line.startAlter();
            return true;
        }
    },
    alterLineEndAndSave: function () {
        this.currentLine.endAlterAndSave();
        this.currentLine = null;
    },
    alterLineEndAndCancel: function () {
        this.currentLine.endAlterAndCancel();
        this.currentLine = null;
    },
    addStationIntoCurrentLine: function (station) {
        this.currentLine.addStationIntoLine(station);
        this.currentLine.drawDrivingRoute();
    },
    outputLines: function () {
        var lineData = {};
        lineData.sum = this.lineList.length;
        lineData.routes = [];
        var tempLine;
        for (var i = 0; i < this.lineList.length; i++) {
            tempLine = {};
            if (this.lineList[i].lineId)
                tempLine.routeID = this.lineList[i].lineId;
            else
                tempLine.routeID = -1;
            tempLine.routeName = this.lineList[i].getName();
            lineData.routes.push(tempLine);
        }
        return lineData;
    },
    outputLineStations: function () {
        //TODO
    }
};
//-------------------------------------------------Global Variables--------------------------------------------------//

//地图
var map = null;

//---------------------------------------------------OPERATION-------------------------------------------------------//

function changeToStationMode() {
    map.changeMode("stationSetting");
    document.getElementById("modeTip").innerHTML = "当前模式:站点设置模式";
}

function changeToLineMode() {
    map.changeMode("lineSetting");
    document.getElementById("modeTip").innerHTML = "当前模式:线路设置模式";
}

function showEmployee() {
    map.printOrRemoveEmployeePoint();
    if (map.employeePointIsPrinted()) {
        document.getElementById("showEmployee").value = "隐藏员工住址点";
    }
    else {
        document.getElementById("showEmployee").value = "显示员工住址点";
    }
}

function test_saveData(data) {
    document.getElementById("outputData").innerHTML = JSON.stringify(map.outputStations());
    document.getElementById("outputData2").innerHTML = JSON.stringify(map.outputLines());
}

function test_loadData() {
    var str = '{"state":1,"sum":8,"stations":[{"stationID":1,"longitude":116.37884,"latitude":40.110133,"stationName":"温都水城"},{"stationID":2,"longitude":116.402716,"latitude":40.109481,"stationName":"王府温馨公寓"},{"stationID":3,"longitude":116.381135,"latitude":40.106888,"stationName":"平西王府西"},{"stationID":4,"longitude":116.420366,"latitude":40.092434,"stationName":"东三旗"},{"stationID":5,"longitude":116.420676,"latitude":40.089655,"stationName":"地铁天通苑北站"},{"stationID":6,"longitude":116.419705,"latitude":40.081869,"stationName":"东三旗南"},{"stationID":7,"longitude":116.419157,"latitude":40.076428,"stationName":"天通苑太平庄"},{"stationID":8,"longitude":116.419448,"latitude":40.072059,"stationName":"天通西苑北"}]}';
    var stations = JSON.parse(str);
    map.loadStations(stations);

    str = '{"state":1,"sum":2,"routes":[{"routeName":"快三线正"},{"routeName":"快三线逆"}]}';
    var lines = JSON.parse(str);
    map.loadLines(lines);

    str = '{"state":1,"sum":16,"routeStations":[{"id":1,"stationID":1,"routeName":"快三线正","sequence":1},{"id":2,"stationID":2,"routeName":"快三线正","sequence":2},{"id":3,"stationID":3,"routeName":"快三线正","sequence":3},{"id":4,"stationID":4,"routeName":"快三线正","sequence":4},{"id":5,"stationID":5,"routeName":"快三线正","sequence":5},{"id":6,"stationID":6,"routeName":"快三线正","sequence":6},{"id":7,"stationID":7,"routeName":"快三线正","sequence":7},{"id":8,"stationID":8,"routeName":"快三线正","sequence":8},{"id":9,"stationID":8,"routeName":"快三线逆","sequence":1},{"id":10,"stationID":7,"routeName":"快三线逆","sequence":2},{"id":11,"stationID":6,"routeName":"快三线逆","sequence":3},{"id":12,"stationID":5,"routeName":"快三线逆","sequence":4},{"id":13,"stationID":4,"routeName":"快三线逆","sequence":5},{"id":14,"stationID":3,"routeName":"快三线逆","sequence":6},{"id":15,"stationID":2,"routeName":"快三线逆","sequence":7},{"id":16,"stationID":1,"routeName":"快三线逆","sequence":8}]}';
    var lineStations = JSON.parse(str);
    map.loadLineStations(lineStations);
}

function saveData(data) {
    alert(JSON.stringify(map.outputStations()));
    alert(JSON.stringify(map.outputLines()));
}

function loadData() {
    $.ajax({
        type: 'GET',
        url: 'api/station',
        success: function (responseData) {
            alert(JSON.parse(responseData).stations.length);
            map.loadStations(JSON.parse(responseData));

        },
        error: function (responseData) {
            alert('error');
        }
    });
    $.ajax({
        type: 'GET',
        url: 'api/route',
        success: function (responseData) {
            map.loadLines(JSON.parse(responseData));
        },
        error: function (responseData) {
            alert('error');
        }
    });

    $.ajax({
        type: 'GET',
        url: 'api/routestation',
        success: function (responseData) {
            map.loadLineStations(JSON.parse(responseData));
        },
        error: function (responseData) {
            alert('error');
        }
    });
}

function ccMapSearch() {
    map.search(document.getElementById("searchText").value);
}


//-----------------------------------------------------TEST----------------------------------------------------------//
function test_loadEmployee() {
    var epll = [
        [116.274424, 39.944211],
        [116.328467, 39.841465],
        [116.435401, 39.846784],
        [116.451498, 39.887543],
        [116.357212, 39.860078],
        [116.320418, 39.820188],
        [116.412404, 39.821962],
        [116.465296, 39.860078],
        [116.483694, 39.896401],
        [116.444599, 39.938901],
        [116.398606, 39.909685],
        [116.458397, 39.901715],
        [116.495192, 39.938016],
        [116.444599, 39.977836],
        [116.387108, 39.973413],
        [116.425052, 39.922081],
        [116.408955, 39.958371],
        [116.342264, 39.973413],
        [116.326167, 39.955716],
        [116.383658, 39.982259],
        [116.43885, 39.964565],
        [116.426202, 39.911456],
        [116.36986, 39.899058],
        [116.349163, 39.846784],
        [116.44115, 39.856533],
        [116.477945, 39.888429],
        [116.477945, 39.946867],
        [116.414704, 39.975182],
        [116.331916, 39.953062],
        [116.402056, 39.887543]
    ];
    map.loadEmployeePoints(epll);
    alert("员工信息加载完成");
}
