/* global jsb */
const Emitter = require('TayDuEventEmitter');
const convertAssetArrayToObject = (arr) => {
    let ret = {};
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i]._name) {
            ret[arr[i]._name] = arr[i];
        }
    }
    return ret;
};

const registerEvent = function (eventCode, func, main) {
    if (!main.eventMap) {
        main.eventMap = [];
    }
    const funcKey = func.bind(main);
    main.eventMap.push({eventCode, funcKey});
    Emitter.instance.registerEvent(eventCode, funcKey);
};
const removeEvent = function (eventCode, main) {
    if (!main.eventMap || !Emitter.instance) return;
    main.eventMap.forEach(e => {
        if(e.eventCode === eventCode) {
            Emitter.instance.removeEvent(e.eventCode, e.funcKey);
        }
    });
    main.eventMap.length = 0;
};
const removeEvents = function (main) {
    if (!main.eventMap || !Emitter.instance) return;
    main.eventMap.forEach(e => {
        Emitter.instance.removeEvent(e.eventCode, e.funcKey);
    });
    main.eventMap.length = 0;
};

const formatWalletMoney = function (num, digits = 2) {
    if (isNaN(parseFloat(num))) return 0;
    const si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return toFixed((num / si[i].value), digits).replace(rx, "$1") + si[i].symbol;
};
const formatMoney = function (amount, decimalCount = 0, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount)
            ? 2
            : decimalCount;

        const negativeSign = amount < 0
            ? "-"
            : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3)
            ? i.length % 3
            : 0;

        return negativeSign + (
            j
                ? i.substr(0, j) + thousands
                : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (
            decimalCount
                ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2)
                : "");
    } catch (e) {
        cc.log(e);
    }

    return 0;
};

const toFixed = (num, fixed) => {
    let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?'); // eslint-disable-line
    let result = (num).toString().match(re)[0];
    return result;
}

const convertSymbolIndexToMatrix = (symbolIndex) => {
    // 7,9,8,8,9
    // 6,9,3,6,7
    // 4,2,7,7,5
    // 4,7,2,1,1
    // 1,8,2,8,7
    const data = {
        1: { x:0, y:4}, 2: { x:1, y:4}, 3: { x:2, y:4}, 4: { x:3, y:4}, 5: { x:4, y:4},

        6: { x:0, y:3}, 7: { x:1, y:3}, 8: { x:2, y:3}, 9: { x:3, y:3}, 10: { x:4, y:3},

        11: { x:0, y:2}, 12: { x:1, y:2}, 13: { x:2, y:2}, 14: { x:3, y:2}, 15: { x:4, y:2},

        16: { x:0, y:1}, 17: { x:1, y:1}, 18: { x:2, y:1}, 19: { x:3, y:1}, 20: { x:4, y:1},

        21: { x:0, y:0}, 22: { x:1, y:0}, 23: { x:2, y:0}, 24: { x:3, y:0}, 25: { x:4, y:0},
    }
    return data[symbolIndex];
}
const convertSlotMatrixTBLR = (arr = [1,8,2,8,7,4,7,2,1,1,4,2,7,7,5,6,9,3,6,7,7,9,8,8,9], format = [5,5,5,5,5]) => {
    const finalArr = [];
    let copyArr = arr.slice();
    const colNum = format.length;
    for (let col = 0; col < colNum; col++) {
        finalArr[col] = [];
    }
    for (let col = 0; col < colNum; col++) {
        const rowNum = format[col];
        for (let row = 0; row < rowNum; row++) {
            finalArr[col][row] = copyArr[(rowNum*colNum-colNum)-(row*rowNum)+col];
        }
    }
    return finalArr;
};

const duplicateElements = (array) => {
    return Array.from(new Set(array.map(JSON.stringify))).map(JSON.parse);

};

const getRotation = function (p1, p2) {
    if (p1 == null || p2 == null)
        return 0;
    return Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI;
};

const getPositionInOtherNode = (spaceNode, targetNode) => {
    if (targetNode.parent == null) {
        return null;
    }
    let pos = targetNode.parent.convertToWorldSpaceAR(targetNode.getPosition());
    return spaceNode.convertToNodeSpaceAR(pos);
};

const changeParent = (child, newParent) => {
    if (newParent === child.parent) return;
    const worldPos = child.convertToWorldSpaceAR(cc.v2(0, 0));
    const newPos = newParent.convertToNodeSpaceAR(worldPos);
    const angle = getWorldAngle(child) - getWorldAngle(newParent);
    child.parent = newParent;
    child.setPosition(newPos);
    child.angle = angle;
}

const  getWorldAngle = (node) => { 
    let currNode = node;
    let angle = currNode.angle;
    while (currNode.parent != null) {
        currNode = currNode.parent;
        angle += currNode.angle;
    }
    return angle % 360;
};

const getRandomInt = (min, max) =>{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const cloneObject = (obj) =>{
    return JSON.parse(JSON.stringify(obj));
}

const formatTime = (timeStrimg) =>{
    let dateFormat= new Date(Date.parse(timeStrimg));
    const date =   dateFormat.getDate() < 10 ? "0" + dateFormat.getDate(): dateFormat.getDate()
    const month = dateFormat.getMonth()+1 < 10 ? "0" + (dateFormat.getMonth()+1) : (dateFormat.getMonth()+1);
    const year = dateFormat.getFullYear();
    const hour = dateFormat.getHours() < 10 ? "0" + dateFormat.getHours(): dateFormat.getHours();
    const minutes = dateFormat.getMinutes() < 10 ? "0" + dateFormat.getMinutes(): dateFormat.getMinutes()
    return  date + "/" + month + "/" + year + " " + hour + ":"+ minutes
}

module.exports = {
    formatTime,
    cloneObject,
    getRandomInt,
    changeParent,
    getPositionInOtherNode,
    getRotation,
    formatWalletMoney,
    formatMoney,
    duplicateElements,
    convertSlotMatrixTBLR,
    convertAssetArrayToObject,
    convertSymbolIndexToMatrix,
    registerEvent,
    removeEvent,
    removeEvents
};
