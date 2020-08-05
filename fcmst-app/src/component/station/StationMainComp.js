/**
 * Created by bitholic on 16/8/12.
 */
import React from 'react'

import {Row, Col, Input, Radio, Button} from 'antd'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

import classNames from 'classnames';

import "../../css/ccmap.css"

var StationMapComp = React.createClass({
    getInitialState(){
        return {
            searchValue: '',
            searchFocus: false,
            mode: 'station',
        }
    },
    componentWillMount(){
        if(this.props.location.query.mode == 'route') {
            this.setState({
                mode: 'route'
            });
        }
    },
    componentDidMount(){
        if(this.state.mode == 'route'){
            initCCMap("lineSetting", "mapContainer", "mapMenu");
        }else{
            initCCMap("stationSetting", "mapContainer", "mapMenu");
        }
    },
    handleInputChange(e) {
        this.setState({
            searchValue: e.target.value,
        });
    },
    handleFocusBlur(e) {
        this.setState({
            searchFocus: e.target === document.activeElement,
        });
    },
    handleSearch() {
        console.log(this.state.searchValue);
        ccMapSearch(this.state.searchValue);
    },
    handleModeChange(e){
        console.log(e.target.value);
        this.setState({
            mode: e.target.value
        });
        if(e.target.value == 'station'){
            changeToStationMode();
        }else{
            console.log('route');
            changeToLineMode();
        }
    },
    render(){
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!this.state.searchValue.trim(),
        });
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.searchFocus,
        });
        return (
            <div className="div-h">
                <Row className="div-h">
                    <Col span={6} className="div-h">
                        <div className="ant-search-input-wrapper" id="searchDiv">
                            <InputGroup className={searchCls}>
                                <Input placeholder="输入地点进行定位" value={this.state.searchValue} onChange={this.handleInputChange}
                                       onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onPressEnter={this.handleSearch}
                                />
                                <div className="ant-input-group-wrap">
                                    <Button icon="search" className={btnCls} onClick={this.handleSearch} />
                                </div>
                            </InputGroup>
                        </div>
                        <div id="mode">
                            <RadioGroup defaultValue={this.state.mode} onChange={this.handleModeChange}>
                                <RadioButton value="station">站点模式</RadioButton>
                                <RadioButton value="route">线路模式</RadioButton>
                            </RadioGroup>
                        </div>
                        <div id="save">
                            <Button onClick={test_saveData}>保存修改</Button>
                        </div>
                        <div id="mapMenu"></div>
                    </Col>
                    <Col span={18} className="div-h">
                        <div id="mapContainer"></div>
                    </Col>
                </Row>
            </div>
        )
    }
});

var colorBuffer = {
    pointer: 0,
    colorSet: ["blue", "red", "green", "purple", "orange", "black", "brown", "grey"],
    getColor: function () {
        var color = this.colorSet[this.pointer];
        this.pointer = (this.pointer + 1) % this.colorSet.length;
        return color;
    },
    reset: function () {
        this.pointer = 0;
    }
};

function Station(ccMap, stationName, stationPoint, stationId) {
    this.stationId = stationId;
    this.ccMap = ccMap;
    this.marker = new BMap.Marker(stationPoint);
    this.marker.setTitle(stationName);
    this.marker.addEventListener("click", ccMap.event_marker_click);
    this.marker.enableDragging();
    var newStation = this;
    var newMarker = this.marker;
    newMarker.addEventListener("dragend", function () {
        newStation.altered = true;
        if (ccMap.menuManager.previseAllLine.checked) {
            for (var i = 0; i < this.lineList.length; i++)
                ccMap.lineList[i].clearPreviseForCheckbox();
            colorBuffer.reset();
            for (var i = 0; i < this.lineList.length; i++)
                ccMap.lineList[i].previseForCkeckbox();
        }
    });
    this.marker.infoWindow = new BMap.InfoWindow(
        '<input type="text" id="name" value=' + newStation.marker.getTitle() + '><p>' + newStation.marker.getPosition().lng + '</p><p>' + newStation.marker.getPosition().lat + '</p>', {
            width: 250,
            height: 100,
            title: ""
        });
    this.marker.infoWindow.addEventListener("open", function (e) {
        e.target.setContent('<input type="text" id="name" value=' + newMarker.getTitle() + '><p>' + newMarker.getPosition().lng + '</p><p>' + newMarker.getPosition().lat + '</p>');
        newMarker.disableDragging();
    });
    this.marker.infoWindow.addEventListener("close", function (e) {
        newStation.setName(document.getElementById('name').value);
        if (newMarker.getMap().ccMap.mode == "stationSetting")
            newMarker.enableDragging();
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

    //this.marker.setIcon(this.ccMap.defaultIcon);
    var a = this.marker.getOffset();

    ccMap.mainMap.addOverlay(this.marker);
}
Station.prototype = {
    altered: false,
    stationId: null,
    stationElement: null,
    tempIcon: null,
    setName: function (newName) {
        this.marker.setTitle(newName);
        this.ccMap.menuManager.renameStationElement(this, newName);
        this.altered = true;
    },
    getName: function () {
        return this.marker.getTitle();
    },
    destroy: function () {
        this.ccMap.menuManager.deleteStationElement(this);
        this.ccMap.mainMap.removeOverlay(this.marker);
    },
    changeMouseOverIcon: function () {
        this.tempIcon = this.marker.getIcon();
        this.marker.setIcon(this.ccMap.mouseMoveIcon);
        this.marker.setTop(true);
    },
    changeMouseOutIcon: function () {
        this.marker.setIcon(this.tempIcon);
        this.marker.setTop(false);
    }
};

function LineData(line) {
    this.lineName = line.lineName;
    this.lineNodeList = [];
    for (var i = 0; i < line.lineNodeList.length; i++)
        this.lineNodeList.push(line.lineNodeList[i]);
}
function LineNode(station, id) {
    this.station = station;
    this.id = id;
    this.altered = false;
}
function Line(ccMap, lineName, lineId) {
    this.lineId = lineId;
    this.lineNodeList = [];
    this.ccMap = ccMap;
    this.lineName = lineName;
    var line = this;
    this.drivingRoute = new BMap.DrivingRoute(ccMap.mainMap, {
        renderOptions: {
            map: ccMap.mainMap,
            autoViewport: false,
            enableDragging: false
        }
    });
    this.drivingRoute.setMarkersSetCallback(function (pois) {
        line.lineNodeList[0].station.marker.setIcon(pois[0].marker.getIcon());
        line.lineNodeList[line.lineNodeList.length - 1].station.marker.setIcon(pois[pois.length - 1].marker.getIcon());
        for (var i = 1; i < pois.length - 1; i++) {
            line.lineNodeList[i].station.marker.setIcon(pois[i].Lm.getIcon());
            line.lineNodeList[i].station.marker.setOffset(pois[i].Lm.getOffset());
        }
        line.ccMap.mainMap.removeOverlay(pois[0].marker);
        line.ccMap.mainMap.removeOverlay(pois[pois.length - 1].marker);
        for (var i = 1; i < pois.length - 1; i++)
            line.ccMap.mainMap.removeOverlay(pois[i].Lm);
    });

    this.previseRoute = new BMap.DrivingRoute(this.ccMap.mainMap, {
        renderOptions: {
            map: ccMap.mainMap,
            autoViewport: false,
            enableDragging: false
        }
    });
    this.previseRoute.setMarkersSetCallback(function (pois) {
        line.lineNodeList[0].station.marker.setIcon(pois[0].marker.getIcon());
        line.lineNodeList[line.lineNodeList.length - 1].station.marker.setIcon(pois[pois.length - 1].marker.getIcon());
        for (var i = 1; i < pois.length - 1; i++) {
            line.lineNodeList[i].station.marker.setIcon(pois[i].Lm.getIcon());
            line.lineNodeList[i].station.marker.setOffset(pois[i].Lm.getOffset());
        }
        line.ccMap.mainMap.removeOverlay(pois[0].marker);
        line.ccMap.mainMap.removeOverlay(pois[pois.length - 1].marker);
        for (var i = 1; i < pois.length - 1; i++)
            line.ccMap.mainMap.removeOverlay(pois[i].Lm);
    });
    this.previseRoute.setSearchCompleteCallback(function () {
        if (!line.mouseOver)
            line.previseRoute.clearResults();
        for (var i = 0; i < line.lineNodeList.length; i++) {
            line.lineNodeList[i].station.marker.setIcon(line.ccMap.defaultIcon);
            line.lineNodeList[i].station.marker.setOffset(new BMap.Size(0, 0));
        }
    });
    this.previseRoute.setPolylinesSetCallback(function (routes) {
        if (ccMap.menuManager.previseAllLine.checked)
            for (var i = 0; i < routes.length; i++)
                ccMap.mainMap.removeOverlay(routes[i].getPolyline());
    });

    this.previseRouteForCheckbox = new BMap.DrivingRoute(this.ccMap.mainMap, {
        renderOptions: {
            map: ccMap.mainMap,
            autoViewport: false,
            enableDragging: false
        }
    });
    this.previseRouteForCheckbox.setMarkersSetCallback(function (pois) {
        line.ccMap.mainMap.removeOverlay(pois[0].marker);
        line.ccMap.mainMap.removeOverlay(pois[pois.length - 1].marker);
        for (var i = 1; i < pois.length - 1; i++)
            line.ccMap.mainMap.removeOverlay(pois[i].Lm);
    });
    this.previseRouteForCheckbox.setPolylinesSetCallback(function (routes) {
        var color = colorBuffer.getColor();
        for (var i = 0; i < routes.length; i++) {
            routes[i].getPolyline().setStrokeColor(color);
            //routes[i].getPolyline().setStrokeWeight(8);
        }
    });
    this.lineElement = this.ccMap.menuManager.createLineElement(this);
}
Line.prototype = {
    altered: false,
    lineElement: null,
    lineAlterTemp: null,
    deletedLineNodeTemp: [],
    alteredLineNodeTemp: [],
    mouseOver: false,
    getName: function () {
        return this.lineName;
    },
    setName: function (newName) {
        this.lineName = newName;
    },
    addStationIntoLine: function (station, id) {
        for (var i = 0; i < this.lineNodeList.length; i++)
            if (this.lineNodeList[i].station == station) {
                console.log("此站已在线路中");
                return;
            }
        var newLineNode = new LineNode(station, id);
        this.lineNodeList.push(newLineNode);
        newLineNode.lineNodeElement = this.ccMap.menuManager.addStationElementIntoLineElement(this, newLineNode);
    },
    deleteStationFromLineByStation: function (stationForDelete) {
        var lineNodeForDelete;
        for (var i = 0; i < this.lineNodeList.length; i++)
            this.lineNodeList[i].altered = true;
        for (var i = 0; i < this.lineNodeList.length; i++)
            if (this.lineNodeList[i].station == stationForDelete) {
                lineNodeForDelete = this.lineNodeList[i];
                for (var j = i; j < this.lineNodeList.length - 1; j++)
                    this.lineNodeList[j] = this.lineNodeList[j + 1];
                this.lineNodeList.pop();
                stationForDelete.marker.setIcon(this.ccMap.defaultIcon);
                if (this.lineNodeList.length < 2)
                    this.drivingRoute.clearResults();
                else if (this.ccMap.currentLine == this)
                    this.drawDrivingRoute();
                break;
            }

        this.ccMap.menuManager.deleteStationElementFromLineElement(this, lineNodeForDelete);
        this.deletedLineNodeTemp.push(lineNodeForDelete);
        return lineNodeForDelete;
    },
    deleteStationFromLineByLineNode: function (lineNodeForDelete) {
        for (var i = 0; i < this.lineNodeList.length; i++)
            this.lineNodeList[i].altered = true;
        for (var i = 0; i < this.lineNodeList.length; i++)
            if (this.lineNodeList[i] == lineNodeForDelete) {
                for (var j = i; j < this.lineNodeList.length - 1; j++)
                    this.lineNodeList[j] = this.lineNodeList[j + 1];
                this.lineNodeList.pop();
                lineNodeForDelete.station.marker.setIcon(this.ccMap.defaultIcon);
                if (this.lineNodeList.length < 2)
                    this.drivingRoute.clearResults();
                else if (this.ccMap.currentLine == this)
                    this.drawDrivingRoute();
                break;
            }
        this.ccMap.menuManager.deleteStationElementFromLineElement(this, lineNodeForDelete);
        this.deletedLineNodeTemp.push(lineNodeForDelete);
        return lineNodeForDelete;
    },
    swapStation: function (index1, index2) {
        if ((index1 < 0 || index1 > this.lineNodeList.length - 1) || (index2 < 0 || index2 > this.lineNodeList.length - 1)) {
            alert("不可移动!");
            return;
        }
        this.alteredLineNodeTemp.push(this.lineNodeList[index1]);
        this.alteredLineNodeTemp.push(this.lineNodeList[index2]);
        var temp = this.lineNodeList[index1];
        this.lineNodeList[index1] = this.lineNodeList[index2];
        this.lineNodeList[index2] = temp;
        this.drawDrivingRoute();
        this.ccMap.menuManager.swapLineStationElement(this, index1, index2);
    },
    drawDrivingRoute: function () {
        if (this.lineNodeList.length < 1) {
            this.clearDrivingRoute();
            return;
        }
        var pathPoints = [];
        for (var i = 1; i < this.lineNodeList.length - 1; i++) {
            pathPoints.push(this.lineNodeList[i].station.marker.getPosition());
        }
        var startPoint = this.lineNodeList[0].station.marker.getPosition();
        var endPoint = this.lineNodeList[this.lineNodeList.length - 1].station.marker.getPosition();
        this.drivingRoute.clearResults();
        this.drivingRoute.search(startPoint, endPoint, {
            waypoints: pathPoints
        });
    },
    clearDrivingRoute: function () {
        for (var i = 0; i < this.lineNodeList.length; i++) {
            this.lineNodeList[i].station.marker.setIcon(this.ccMap.defaultIcon);
            this.lineNodeList[i].station.marker.setOffset(new BMap.Size(0, 0));
        }
        this.drivingRoute.clearResults();
    },
    startAlter: function () {
        this.clearPrevise();
        this.lineAlterTemp = new LineData(this);
        this.drawDrivingRoute();
        this.deletedLineNodeTemp = [];
        this.alteredLineNodeTemp = [];
    },
    endAlterAndSave: function () {
        this.lineAlterTemp = null;
        this.clearDrivingRoute();
        this.altered = true;
        for (var i = 0; i < this.deletedLineNodeTemp.length; i++)
            if (this.deletedLineNodeTemp[i].id)
                this.ccMap.deletedLineNodeIDList.push(this.deletedLineNodeTemp[i].id);
        for (var i = 0; i < this.alteredLineNodeTemp.length; i++)
            this.alteredLineNodeTemp[i].altered = true;
    },
    endAlterAndCancel: function () {
        this.clearDrivingRoute();
        this.lineName = this.lineAlterTemp.lineName;
        this.lineNodeList = this.lineAlterTemp.lineNodeList;
    },
    destroy: function () {
        this.clearPrevise();
        this.clearPreviseForCheckbox();
        this.clearDrivingRoute();
        this.ccMap.menuManager.deleteLineElement(this);
    },
    previse: function () {
        if (this.lineNodeList.length < 2)
            return;
        var pathPoints = [];
        for (var i = 1; i < this.lineNodeList.length - 1; i++) {
            pathPoints.push(this.lineNodeList[i].station.marker.getPosition());
        }
        var startPoint = this.lineNodeList[0].station.marker.getPosition();
        var endPoint = this.lineNodeList[this.lineNodeList.length - 1].station.marker.getPosition();
        this.previseRoute.search(startPoint, endPoint, {
            waypoints: pathPoints
        });
    },
    clearPrevise: function () {
        this.previseRoute.clearResults();
        for (var i = 0; i < this.lineNodeList.length; i++) {
            this.lineNodeList[i].station.marker.setIcon(this.ccMap.defaultIcon);
            this.lineNodeList[i].station.marker.setOffset(new BMap.Size(0, 0));
        }
    },
    previseForCkeckbox: function () {
        if (this.lineNodeList.length < 2)
            return;
        var pathPoints = [];
        for (var i = 1; i < this.lineNodeList.length - 1; i++) {
            pathPoints.push(this.lineNodeList[i].station.marker.getPosition());
        }
        var startPoint = this.lineNodeList[0].station.marker.getPosition();
        var endPoint = this.lineNodeList[this.lineNodeList.length - 1].station.marker.getPosition();
        this.previseRouteForCheckbox.search(startPoint, endPoint, {
            waypoints: pathPoints
        });
    },
    clearPreviseForCheckbox: function () {
        this.previseRouteForCheckbox.clearResults();
        for (var i = 0; i < this.lineNodeList.length; i++) {
            this.lineNodeList[i].station.marker.setIcon(this.ccMap.defaultIcon);
            this.lineNodeList[i].station.marker.setOffset(new BMap.Size(0, 0));
        }
    }
};

function MenuManager(ccMap, menuDivName) {
    this.ccMap = ccMap;
    this.menuDiv = document.getElementById(menuDivName);
    this.menuDiv.className = "ccMapMenu";
    this.checkboxDiv = document.createElement("div");
    var employeeCheckBox = document.createElement("input");
    var showEmployeeLabel = document.createElement("label");
    employeeCheckBox.type = "checkbox";
    employeeCheckBox.id = "employeeCheckBox";
    showEmployeeLabel.for = "employeeCheckBox";
    showEmployeeLabel.innerHTML = "显示员工住址点";
    employeeCheckBox.addEventListener("click", function () {
        if (employeeCheckBox.checked)
            ccMap.printEmployeePoint();
        else
            ccMap.removeEmployeePoint();
    });
    this.checkboxDiv.appendChild(employeeCheckBox);
    this.checkboxDiv.appendChild(showEmployeeLabel);
    this.previseAllLine = document.createElement("input");
    var previseAllLineLabel = document.createElement("label");
    this.previseAllLine.type = "checkbox";
    this.previseAllLine.id = "previseAllLineCheckBox";
    previseAllLineLabel.for = "previseAllLineCheckBox";
    previseAllLineLabel.innerHTML = "预览所有线路";
    this.previseAllLine.addEventListener("click", function (e) {
        if (ccMap.menuManager.previseAllLine.checked) {
            for (var i = 0; i < ccMap.lineList.length; i++)
                ccMap.lineList[i].previseForCkeckbox();
        } else {
            for (var i = 0; i < ccMap.lineList.length; i++)
                ccMap.lineList[i].clearPreviseForCheckbox();
            colorBuffer.reset();
        }
    });
    this.checkboxDiv.appendChild(this.previseAllLine);
    this.checkboxDiv.appendChild(previseAllLineLabel);
    var employeeDiv = document.createElement("div");
    var previseAllLineDiv = document.createElement("div");
    employeeDiv.appendChild(employeeCheckBox);
    employeeDiv.appendChild(showEmployeeLabel);
    previseAllLineDiv.appendChild(this.previseAllLine);
    previseAllLineDiv.appendChild(previseAllLineLabel);
    this.checkboxDiv.appendChild(employeeDiv);
    this.checkboxDiv.appendChild(previseAllLineDiv);
    this.menuDiv.appendChild(this.checkboxDiv);
    this.stationMenuDiv = document.createElement("div");
    this.stationMenuDiv.style.display = "none";
    this.menuDiv.appendChild(this.stationMenuDiv);
    this.lineMenuDiv = document.createElement("div");
    this.lineMenuDiv.style.display = "none";
    this.menuDiv.appendChild(this.lineMenuDiv);
    this.stationListElement = document.createElement("ol");
    this.stationListElement.className = "olElement";
    this.stationListElement.innerHTML = '<li><div class="liInfo">站点名</div> <div class="liOperations">操作</div></li>';
    this.stationListElement.style.listStyle = "none";
    this.stationMenuDiv.appendChild(this.stationListElement);
    this.lineListElement = document.createElement("ol");
    this.lineListElement.className = "olElement";
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
        newStationElement.addEventListener("mouseover", function (e) {
            newStation.changeMouseOverIcon();
        });
        newStationElement.addEventListener("mouseout", function (e) {
            newStation.changeMouseOutIcon();
        });
        this.stationListElement.appendChild(newStationElement);
        var newStationInfo = document.createElement("div");
        var newStationOperations = document.createElement("div");
        newStationElement.appendChild(newStationInfo);
        newStationElement.appendChild(newStationOperations);
        newStationInfo.className = "liInfo";
        newStationOperations.className = "liOperations";
        var newStationNamePrinter = document.createElement("div");
        var newStationNameTextField = document.createElement("input");
        newStationNameTextField.style.width = "100%";
        newStationNamePrinter.innerHTML = newStation.getName();
        newStationNameTextField.type = "text";
        newStationNameTextField.style.display = "none";
        newStationInfo.appendChild(newStationNamePrinter);
        newStationInfo.appendChild(newStationNameTextField);
        var alterButton = document.createElement("input");
        alterButton.type = "button";
        alterButton.value = "改名";
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
        alterButton.className = "operationButton";
        searchButton.className = "operationButton";
        saveButton.className = "operationButton";
        cancelButton.className = "operationButton";
        deleteButton.className = "operationButton";
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
            saveButton.style.display = "";
            cancelButton.style.display = "";
            deleteButton.style.display = "none";
            searchButton.style.display = "";
        });
        saveButton.addEventListener("click", function () {
            newStation.setName(newStationNameTextField.value);
            newStationNamePrinter.innerHTML = newStation.getName();
            newStationNamePrinter.style.display = "";
            newStationNameTextField.style.display = "none";
            alterButton.style.display = "";
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            deleteButton.style.display = "";
            searchButton.style.display = "none";
        });
        cancelButton.addEventListener("click", function () {
            newStationNamePrinter.innerHTML = newStation.getName();
            newStationNamePrinter.style.display = "";
            newStationNameTextField.style.display = "none";
            alterButton.style.display = "";
            saveButton.style.display = "none";
            cancelButton.style.display = "none";
            deleteButton.style.display = "";
            searchButton.style.display = "none";
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
        var ccMap = this.ccMap;
        newLineHeadElement.addEventListener("mouseover", function (e) {
            newLine.mouseOver = true;
            if (ccMap.currentLine == null) {
                newLine.previse();
            }
        });
        newLineHeadElement.addEventListener("mouseout", function (e) {
            newLine.mouseOver = false;
            if (ccMap.currentLine == null) {
                newLine.clearPrevise();
            }
        });
        var newLineStationListElement = document.createElement("ol");
        newLineStationListElement.className = "olElement";
        newLineStationListElement.style.paddingLeft = "10px";
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
        alterLineButton.className = "lineMainOperationButton";
        saveLineButton.className = "lineMainOperationButton";
        cancelLineButton.className = "lineMainOperationButton";
        deleteLineButton.className = "lineMainOperationButton";
        newLineOperationsElement.appendChild(alterLineButton);
        newLineOperationsElement.appendChild(saveLineButton);
        newLineOperationsElement.appendChild(cancelLineButton);
        newLineOperationsElement.appendChild(deleteLineButton);
        alterLineButton.addEventListener("click", function () {
            if (newLine.ccMap.alterLineStart(newLine)) {
                ccMap.menuManager.previseAllLine.disabled = true;
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
            ccMap.menuManager.previseAllLine.disabled = false;
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
        cancelLineButton.addEventListener("click", function () {
            ccMap.menuManager.previseAllLine.disabled = false;
            newLine.ccMap.alterLineEndAndCancel();
            var stationNum = newLineStationListElement.childNodes.length;
            for (var i = 0; i < stationNum; i++)
                newLineStationListElement.removeChild(newLineStationListElement.childNodes[0]);
            for (var i = 0; i < newLine.lineNodeList.length; i++)
                ccMap.menuManager.addStationElementIntoLineElement(newLine, newLine.lineNodeList[i]);
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
    addStationElementIntoLineElement: function (line, newLineNode) {
        var newLineStationListElement = line.lineElement.childNodes[1];
        var newLineStationLi = document.createElement("li");
        newLineStationLi.addEventListener("mouseover", function (e) {
            newLineNode.station.changeMouseOverIcon();
        });
        newLineStationLi.addEventListener("mouseout", function (e) {
            newLineNode.station.changeMouseOutIcon();
        });
        newLineStationListElement.appendChild(newLineStationLi);
        var newLineStationName = document.createElement("div");
        newLineStationName.className = "liInfo";
        newLineStationName.innerHTML = newLineNode.station.getName();
        var newLineStationOperations = document.createElement("div");
        newLineStationOperations.className = "liOperations";
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
                if (line.lineNodeList[i] == newLineNode)
                    break;
            line.swapStation(i, i - 1);
        });
        downSwapButton.addEventListener("click", function () {
            var i;
            for (i = 0; i < line.lineNodeList.length; i++)
                if (line.lineNodeList[i] == newLineNode)
                    break;
            line.swapStation(i, i + 1);
        });
        deleteStationFromLineButton.addEventListener("click", function () {
            line.deleteStationFromLineByLineNode(newLineNode);
        });
        return newLineStationLi;
    },
    deleteStationElementFromLineElement: function (line, lineNodeForDelete) {
        lineNodeForDelete.station.marker.setAnimation(null);
        line.lineElement.childNodes[1].removeChild(lineNodeForDelete.lineNodeElement);
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

    var mainMap = this.mainMap;
    var ccMap = this;
    //new BMap.LocalCity().get(function (result) {
    //    mainMap.centerAndZoom(result.name);
    //});
    this.mainMap.centerAndZoom("北京");
    this.mainMap.enableScrollWheelZoom(true);
    this.mainMap.addControl(new BMap.MapTypeControl());
    this.mainMap.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_SMALL}));
    this.mainMap.disableDoubleClickZoom();
    this.mainMap.addEventListener("dblclick", this.event_map_dbclick);
    this.mainMap.ccMap = this;

    this.menuManager = new MenuManager(this, menuDivName);
    this.defaultIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
        anchor: new BMap.Size(10, 25),
        imageOffset: new BMap.Size(0, 0 - 11 * 25)
    });
    this.mouseMoveIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
        anchor: new BMap.Size(10, 25),
        imageOffset: new BMap.Size(0, 0 - 10 * 25)
    });
}
CCMap.prototype = {
    mode: null,
    employeePoints: [],
    employeePointsCollection: null,
    stationList: [],
    lineList: [],
    deletedStationIDList: [],
    deletedLineIDList: [],
    deletedLineNodeIDList: [],
    currentLine: null,
    //db
    loadData: function () {
        $.ajax({
            type: 'GET',
            url: 'http://www.bitholic.cn/fcms/api/employees',
            dataType: 'jsonp',
            success: function (responseData) {
                map.loadEmployees(JSON.parse(responseData));
            },
            error: function (responseData) {
                alert('error');
            }
        });
        $.ajax({
            type: 'GET',
            url: 'http://www.bitholic.cn/fcms/api/station',
            dataType: 'jsonp',
            success: function (responseData) {
                map.loadStations(JSON.parse(responseData));
            },
            error: function (responseData) {
                alert('error');
            }
        });
        $.ajax({
            type: 'GET',
            url: 'http://www.bitholic.cn/fcms/api/route',
            dataType: 'jsonp',
            success: function (responseData) {
                map.loadLines(JSON.parse(responseData));
            },
            error: function (responseData) {
                alert('error');
            }
        });
        $.ajax({
            type: 'GET',
            url: 'http://www.bitholic.cn/fcms/api/routeStations',
            dataType: 'jsonp',
            success: function (responseData) {
                map.loadLineStations(JSON.parse(responseData));
            },
            error: function (responseData) {
                alert('error');
            }
        });
    },
    saveData: function () {
        //TODO
        alert(JSON.stringify(map.outputStations()));
        alert(JSON.stringify(map.outputLines()));
        alert(JSON.stringify(map.outputLineStations()));
    },

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
    loadEmployees: function (employeesData) {
        this.employeePoints = [];
        for (var i = 0; i < employeesData.sum; i++)
            this.employeePoints.push([employeesData.employees[i].longitude, employeesData.employees[i].latitude]);
    },
    printEmployeePoint: function () {
        if (document.createElement('canvas').getContext) {// 判断当前浏览器是否支持绘制海量点
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
            alert('请在chrome、safari、IE8+以上浏览器绘制');
        }
    },
    removeEmployeePoint: function () {
        if (this.employeePointsCollection) {
            this.mainMap.removeOverlay(this.employeePointsCollection);
            this.employeePointsCollection = null;
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
    deleteStationByStation: function (stationForDelete) {
        var list = [];
        for (var i = 0; i < this.lineList.length; i++)
            for (var j = 0; j < this.lineList[i].lineNodeList.length; j++)
                if (this.lineList[i].lineNodeList[j].station == stationForDelete) {
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
                for (var i = 0; i < list.length; i++) {
                    var lineNodeForDelete = list[i].deleteStationFromLineByStation(stationForDelete);
                    if (lineNodeForDelete.id)
                        this.deletedLineNodeIDList.push(lineNodeForDelete.id);
                }
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
        if (stationForDelete.stationId)
            this.deletedStationIDList.push(stationForDelete.stationId);
        stationForDelete.destroy();
        if (this.menuManager.previseAllLine.checked) {
            for (var i = 0; i < this.lineList.length; i++)
                this.lineList[i].clearPreviseForCheckbox();
            colorBuffer.reset();
            for (var i = 0; i < this.lineList.length; i++)
                this.lineList[i].previseForCkeckbox();
        }
    },
    outputStations: function () {
        var stationData = {};
        stationData.alteredStations = [];
        stationData.newStations = [];
        stationData.deletedStationsID = [];
        var tempStation;
        for (var i = 0; i < this.stationList.length; i++) {
            tempStation = {};
            if (this.stationList[i].stationId)
                if (!this.stationList[i].altered)
                    continue;
                else
                    tempStation.stationID = this.stationList[i].stationId;
            else
                tempStation.stationID = -1;
            tempStation.stationName = this.stationList[i].getName();
            tempStation.longitude = this.stationList[i].marker.getPosition().lng;
            tempStation.latitude = this.stationList[i].marker.getPosition().lat;
            if (tempStation.stationID == -1)
                stationData.newStations.push(tempStation);
            else
                stationData.alteredStations.push(tempStation);
        }
        for (var i = 0; i < this.deletedStationIDList.length; i++)
            stationData.deletedStationsID.push(this.deletedStationIDList[i]);
        return stationData;
    },

    //line
    createLine: function (lineName, id) {
        if (lineName == "")
            lineName = "新线路";
        this.lineList.push(new Line(this, lineName, id));
    },
    loadLines: function (linesData) {
        var lines = linesData.routes;
        for (var i = 0; i < linesData.sum; i++)
            this.createLine(lines[i].routeName, lines[i].routeID);
    },
    loadLineStations: function (lineStationsData) {
        var lineStations = lineStationsData.routeStations;
        var line = null;
        var station = null;
        for (var i = 0; i < lineStationsData.sum; i++) {
            for (var j = 0; j < this.lineList.length; j++)
                if (this.lineList[j].getName() == lineStations[i].routeName) {
                    line = this.lineList[j];
                    break;
                }
            for (var k = 0; k < this.stationList.length; k++)
                if (this.stationList[k].stationId == lineStations[i].stationID) {
                    station = this.stationList[k];
                    break;
                }
            line.addStationIntoLine(station, lineStationsData.routeStations[i].id);
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
        if (lineForDelete.lineId)
            this.deletedLineIDList.push(lineForDelete.lineId);
        lineForDelete.destroy();
    },
    alterLineStart: function (line) {
        if (this.currentLine) {
            alert("请先保存或取消当前正在修改的线路");
            return false;
        }
        else {
            this.currentLine = line;
            if (this.menuManager.previseAllLine.checked)
                for (var i = 0; i < this.lineList.length; i++)
                    this.lineList[i].clearPreviseForCheckbox();
            colorBuffer.reset();
            line.startAlter();
            return true;
        }
    },
    alterLineEndAndSave: function () {
        this.currentLine.endAlterAndSave();
        this.currentLine = null;
        if (this.menuManager.previseAllLine.checked)
            for (var i = 0; i < this.lineList.length; i++)
                this.lineList[i].previseForCkeckbox();
    },
    alterLineEndAndCancel: function () {
        this.currentLine.endAlterAndCancel();
        this.currentLine = null;
        if (this.menuManager.previseAllLine.checked)
            for (var i = 0; i < this.lineList.length; i++)
                this.lineList[i].previseForCkeckbox();
    },
    addStationIntoCurrentLine: function (station) {
        this.currentLine.addStationIntoLine(station);
        this.currentLine.drawDrivingRoute();
    },
    outputLines: function () {
        var lineData = {};
        lineData.alteredRoutes = [];
        lineData.newRoutes = [];
        lineData.deleteRoutesId = [];
        var tempLine;
        for (var i = 0; i < this.lineList.length; i++) {
            tempLine = {};
            if (this.lineList[i].lineId)
                if (!this.lineList[i].altered)
                    continue;
                else
                    tempLine.routeID = this.lineList[i].lineId;
            else
                tempLine.routeID = -1;
            tempLine.routeName = this.lineList[i].getName();
            if (tempLine.routeID == -1)
                lineData.newRoutes.push(tempLine);
            else
                lineData.alteredRoutes.push(tempLine);
        }
        for (var i = 0; i < this.deletedLineIDList.length; i++)
            lineData.deleteRoutesId.push(this.deletedLineIDList[i]);
        return lineData;
    },
    outputLineStations: function () {
        var lineStationsData = {};
        lineStationsData.newLineStations = [];
        lineStationsData.deletedLineStationsID = [];
        var tempLineStation;
        for (var i = 0; i < this.lineList.length; i++)
            for (var j = 0; j < this.lineList[i].lineNodeList.length; j++) {
                if (this.lineList[i].lineNodeList[j].id && !this.lineList[i].lineNodeList[j].altered)
                    continue;
                else {
                    tempLineStation = {};
                    if (this.lineList[i].lineNodeList[j].id)
                        tempLineStation.id = this.lineList[i].lineNodeList[j].id;
                    else
                        tempLineStation.id = -1;
                    if (!this.lineList[i].lineNodeList[j].station.stationId)
                        tempLineStation.stationID = -1;
                    else
                        tempLineStation.stationID = this.lineList[i].lineNodeList[j].station.stationId;
                    tempLineStation.stationName = this.lineList[i].lineNodeList[j].station.getName();
                    tempLineStation.routeName = this.lineList[i].getName();
                    if (this.lineList[i].lineId)
                        tempLineStation.routeID = this.lineList[i].lineId;
                    else
                        tempLineStation.routeID = -1;
                    tempLineStation.sequence = j + 1;
                    lineStationsData.newLineStations.push(tempLineStation);
                }
            }
        for (var i = 0; i < this.deletedLineNodeIDList.length; i++)
            lineStationsData.deletedLineStationsID.push(this.deletedLineNodeIDList[i]);
        return lineStationsData;

    }
};
//-------------------------------------------------Global Variables--------------------------------------------------//

var map = null;

//---------------------------------------------------OPERATION-------------------------------------------------------//
function initCCMap(mode, mapContainer, mapMenu) {
    map = new CCMap(mapContainer, mapMenu);
    map.changeMode(mode);
    //map.loadData();
    test_loadData();
}

function changeToStationMode() {
    map.changeMode("stationSetting");
}

function changeToLineMode() {
    map.changeMode("lineSetting");
}

function test_saveData(data) {
    //map.saveData();
}

function test_loadData() {
    var str = '{"state":1,"sum":9,"employees":[{"longitude":116.350888,"latitude":39.923409},{"longitude":116.385383,"latitude":39.887986}, {"longitude": 116.38893,"latitude": 39.885536},' +
        '{"longitude": 116.38993, "latitude": 40.005536},{"longitude": 116.361093, "latitude": 40.015536},{"longitude": 115.99093, "latitude": 39.895536},' +
        '{"longitude": 116.400781, "latitude": 40.113729},{"longitude": 117.400781, "latitude": 40.313729},{"longitude": 116.900781, "latitude": 39.913729}]}';
    var employees = JSON.parse(str);
    map.loadEmployees(employees);

    str = '{"state":1,"sum":8,"stations":[{"stationID":1,"longitude":116.37884,"latitude":40.110133,"stationName":"温都水城"},{"stationID":2,"longitude":116.381135,"latitude":40.106888,"stationName":"平西王府西"},{"stationID":3,"longitude":116.402716,"latitude":40.109481,"stationName":"王府温馨公寓"},{"stationID":4,"longitude":116.420366,"latitude":40.092434,"stationName":"东三旗"},{"stationID":5,"longitude":116.420676,"latitude":40.089655,"stationName":"地铁天通苑北站"},{"stationID":6,"longitude":116.419705,"latitude":40.081869,"stationName":"东三旗南"},{"stationID":7,"longitude":116.419157,"latitude":40.076428,"stationName":"天通苑太平庄"},{"stationID":8,"longitude":116.419448,"latitude":40.072059,"stationName":"天通西苑北"}]}';
    var stations = JSON.parse(str);
    map.loadStations(stations);

    str = '{"state":1,"sum":2,"routes":[{"routeName":"快三线正","routeID":"1"},{"routeName":"快三线逆","routeID":"2"}]}';
    var lines = JSON.parse(str);
    map.loadLines(lines);

    str = '{"state":1,"sum":16,"routeStations":[{"id":1,"stationID":1,"routeName":"快三线正","sequence":1},{"id":2,"stationID":2,"routeName":"快三线正","sequence":2},{"id":3,"stationID":3,"routeName":"快三线正","sequence":3},{"id":4,"stationID":4,"routeName":"快三线正","sequence":4},{"id":5,"stationID":5,"routeName":"快三线正","sequence":5},{"id":6,"stationID":6,"routeName":"快三线正","sequence":6},{"id":7,"stationID":7,"routeName":"快三线正","sequence":7},{"id":8,"stationID":8,"routeName":"快三线正","sequence":8},{"id":9,"stationID":8,"routeName":"快三线逆","sequence":1},{"id":10,"stationID":7,"routeName":"快三线逆","sequence":2},{"id":11,"stationID":6,"routeName":"快三线逆","sequence":3},{"id":12,"stationID":5,"routeName":"快三线逆","sequence":4},{"id":13,"stationID":4,"routeName":"快三线逆","sequence":5},{"id":14,"stationID":3,"routeName":"快三线逆","sequence":6},{"id":15,"stationID":2,"routeName":"快三线逆","sequence":7},{"id":16,"stationID":1,"routeName":"快三线逆","sequence":8}]}';
    var lineStations = JSON.parse(str);
    map.loadLineStations(lineStations);
}

function saveData(data) {
    //alert(JSON.stringify(map.outputStations()));
    //alert(JSON.stringify(map.outputLines()));
    alert('保存成功');
}

function ccMapSearch(value) {
    map.search(value);
}

export default StationMapComp;
