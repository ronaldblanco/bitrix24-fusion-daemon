const log = require('../../init/logger')(module),
      createB24Call = require('../cache/createB24Call'),
      getEmployeeList = require('../cache/getEmployeeList');

let create = (headers, cache) => {

    let bitrix24Url = headers['variable_bitrix24_url'];

    let legBNumber = headers['variable_dialed_user'] || headers['Caller-Destination-Number'];
    let legANumber = headers['Caller-Orig-Caller-ID-Number'] || headers['Caller-Caller-ID-Number'];

    getEmployeeList(bitrix24Url, cache, (err, employeeList) => {

        if (err) {
            log("create Cannot get employeeList: " + err);
            return;
        }

        if (employeeList[legANumber]) {
            log("Registering outbound call from extension " + legANumber);
            let bitrix24Info = {
                url: bitrix24Url,
                callerid: legBNumber,
                userID: employeeList[legANumber],
                callUuid: headers['variable_call_uuid'] || headers['variable_uuid'],
                type: 1 // 1 - outbound, 2 - inbound.
            }

            createB24Call(bitrix24Info, cache)
                .then((b24callInfo) => {                    
                    log("Registered outbound call " + bitrix24Info['callUuid'] + " :" + b24callInfo['uuid']);
                }).catch((err) => {
                    // If we can't get call UUID - do nothing. Really
                    log("Registering outbound call " + bitrix24Info['callUuid'] + " failed: " + err);
                });
        }

        if (employeeList[legBNumber]) {
            log("Registering inbound call to extension " + legBNumber);
            let bitrix24Info = {
                url: bitrix24Url,
                callerid: legANumber,
                userID: employeeList[legBNumber],
                callUuid: headers['variable_call_uuid'] || headers['variable_uuid'],
                type: 2 // 1 - outbound, 2 - inbound.
            }

            createB24Call(bitrix24Info, cache)
                .then((b24callInfo) => {                    
                    log("Registered inbound call " + bitrix24Info['callUuid'] + " :" + b24callInfo['uuid']);
                }).catch((err) => {
                    // If we can't get call UUID - do nothing. Really
                    log("Registering inbound call " + bitrix24Info['callUuid'] + " failed: " + err);
                });
        }
    });
}

module.exports = create;