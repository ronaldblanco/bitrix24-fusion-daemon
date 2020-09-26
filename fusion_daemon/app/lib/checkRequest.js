const log = require('../init/logger')(module),
      headersProcess = require('../init/fsheadersprocess'),
      restConfig = require('../config/rest');

	//var wget = require('wget');
	var curl = require("curl");


let checkRequest = (rawHeaders) => {
    let headers = headersProcess(rawHeaders);

    /*if (headers['variable_bitrix24_enabled'] !== 'true') {
        return false;
    }
    if (headers['variable_bitrix24_token'] !== restConfig.entryPoint) {
        return false;
    }

    if (headers['variable_bitrix24_channel'] === 'caller') {
        log('Processing CALLER channel');
        return headers;
    }

    if (headers['variable_bitrix24_channel'] === 'callee') {
        log('Processing CALLEE channel');
        return headers;
    }*/

    //log('Processing ZOMBIE channel: ' + JSON.stringify(headers, null, 2));
	//wget --post-data='data=' + JSON.stringify(headers, null, 2) 'http://www.example.com';
	//curl.postJSON(url, data, options, function(err, response, data){});
	//curl.postJSON('https://techcnet.com/PHONE/skjvalhv84999990/getCallInfo.php', {'hola':'siiii'}, {}, function(err, response, data){console.log(data);});
	
	var myheaders = [{
		'Event-Name': headers['Event-Name'],
		'Call-Direction': headers['Call-Direction'],
		'Channel-Presence-ID': headers['Channel-Presence-ID'],
		'Caller-Destination-Number': headers['Caller-Destination-Number'],
		'Caller-Context': headers['Caller-Context'],
		'variable_caller_id_number': headers['variable_caller_id_number'],
		'variable_outbound_caller_id_number': headers['variable_outbound_caller_id_number'],
		'variable_hangup_cause': headers['variable_hangup_cause']
					}];
	
	curl.postJSON('https://techcnet.com/PHONE/skjvalhv84999990/getCallInfo.php?dataheaders=' + JSON.stringify(myheaders, null, 2), {}, {}, function(err, response, data){log(data);});
	log(headers);
	
    return headers;
}

module.exports = checkRequest;