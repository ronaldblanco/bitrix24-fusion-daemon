dotenv = require('dotenv').config();

const log = require('./app/init/logger')(module),
    bitrixConfig = require('./app/config/bitrix'),
    restConfig = require('./app/config/rest');

	//var curl = require("curl");
	var myesl = require('modesl');
	var myfreeswitchOriginate = require('./app/lib/calls/originate');
	var myfreeswitch = require('./app/init/freeswitch');

	
	//require('dotenv').load();
	//console.log(process.env);

if (bitrixConfig.url) {

    const freeswitch = require('./app/init/freeswitch'),
        cache = require('memory-cache'),

        checkRequest = require('./app/lib/checkRequest'),
        callRinging = require('./app/lib/calls/progress'),
        callAnswer = require('./app/lib/calls/bridge'),
        callCreate = require('./app/lib/calls/create'),
        callHangup = require('./app/lib/calls/hangup');

    // FreeSwitch listener part
    freeswitch
        .on('esl::event::CHANNEL_PROGRESS::*', function(e) {
			//log(JSON.stringify(e.headers));
			//log(JSON.stringify(checkRequest(e.headers)));
            let headers = checkRequest(e.headers);
            if (headers) {
                callRinging(headers, cache);
				log('callRinging');
				//console.log(headers);				
            }
        })
        .on('esl::event::CHANNEL_BRIDGE::*', function(e) {
			//log(JSON.stringify(e.headers));
			//log(JSON.stringify(checkRequest(e.headers)));
            let headers = checkRequest(e.headers);
            if (headers) {
                callAnswer(headers, cache);
				log('callAnswer');
				//console.log(headers);
            }
        })
        .on('esl::event::CHANNEL_HANGUP_COMPLETE::*', function(e) {
			//log(JSON.stringify(e.headers));
			//log(JSON.stringify(checkRequest(e.headers)));
            let headers = checkRequest(e.headers);
            if (headers) {
                callHangup(headers, cache);
				log('callHangup');
				//console.log(headers);
            }
        })
        .on('esl::event::CHANNEL_CREATE::*', function(e) {
			//log(JSON.stringify(e.headers));
			//log(JSON.stringify(checkRequest(e.headers)));
            let headers = checkRequest(e.headers);
            if (headers) {
                callCreate(headers, cache);
				log('callCreate');
				//console.log(headers);
            }
        });

    // Click2Call server part
    if (restConfig.entryPoint) {

        const express = require('express'),
            restHTTPServer = express(),
            bodyParser = require('body-parser'),
            originateB24Call = require('./app/lib/bitrix/originateB24Call');

        restHTTPServer.set('x-powered-by', false);
        restHTTPServer.use(bodyParser.urlencoded({ extended: true }));

        restHTTPServer.get('/rest/1/' + restConfig.entryPoint, (req, res) => {
			//http://155.138.227.120:3000/rest/1/1234567?data=Hola
			//log(restConfig.entryPoint); //1234567
			//log(req.query); //GET
			//log(req.body); //POST
			
			var data = req.query;
			
			let originateInfo = {
                src: data.caller,
                domain: data.domain,
                dst: data.callto,
                timeout: '25',
                autoAnswer: true,
            }
			
			//bridge_channel	sofia/external/4157631793  missing in 7863342521 calls
			//http://155.138.227.120:3000/rest/1/1234567?caller=33333&domain=fusionpbx_client.teczz.com&callto=4157631793
            myfreeswitchOriginate(originateInfo, (err, res) => {
				if (err) {
                    log('originate_Call_err ' + err);
                    return;
                }
                log('originate_Call_res ' + res);
            });
			
			//'originate {click_to_call=true,origination_caller_id_name=7868048092,origination_caller_id_number=7868048092,instant_ringback=true,domain_name=fusionpbx_client.teczz.com,sip_auto_answer=true}sofia/internal/sip:55555@73.46.118.181:52497;rinstance=346c3c64c273a69c;transport=TCP;fs_nat=yes;fs_path=sip%3A55555%4073.46.118.181%3A6199%3Brinstance%3D346c3c64c273a69c%3Btransport%3DTCP 7868048092 XML fusionpbx_client.teczz.com 7868048092 7868048092 25', 
			
			//originate {origination_caller_id_number=9005551212}sofia/default/whatever@wherever 19005551212 XML default CALLER_ID_NAME CALLER_ID_NUMBER
			//originate {origination_caller_id_number=9005551212}sofia/default/whatever@wherever &bridge({origination_caller_id_number=8001234567}sofia/profile/someother@destination.com)
			
			//originate {click_to_call=true,origination_caller_id_name=7863342521,origination_caller_id_number=7863342521,instant_ringback=true,domain_name=fusionpbx_client.teczz.com,sip_auto_answer=true}sofia/internal/sip:33333@73.46.118.181:62382;transport=UDP;rinstance=85dff53f8c968f39 7863342521 XML fusionpbx_client.teczz.com 7863342521 7863342521 25
			
/*myconn = new myesl.Connection('127.0.0.1', 8021, 'ClueCon', function() {
    //myconn.api('status', function(res) {
	myconn.api('originate {click_to_call=true,origination_caller_id_name=7863342521,origination_caller_id_number=7863342521,instant_ringback=true,domain_name=fusionpbx_client.teczz.com,sip_auto_answer=true}sofia/internal/sip:+13055916909@73.46.118.181:52497;rinstance=346c3c64c273a69c;transport=TCP;fs_nat=yes;fs_path=sip%3A+13055916909%4073.46.118.181%3A6199%3Brinstance%3D346c3c64c273a69c%3Btransport%3DTCP &bridge({origination_caller_id_name=+13055916909,bridge_channel=sofia/external/7863342521,outbound_caller_id_number=+13055916909,effective_caller_id_number=+13055916909,effective_caller_id_name=+13055916909,outbound_caller_id_name=+13055916909}sofia/gateway/ea4d05c2-67e2-4778-a2bf-86bbee9457d0/7863342521)', 
	
	function(res) {
        //res is an esl.Event instance
        log(res.getBody());
    });
});*/
			
			
			//curl.postJSON('https://127.0.0.1/app/click_to_call/click_to_call.php?username=API&password=Zxcqwe123Zxcqwe123*&src_cid_name=55555&src_cid_number=55555&dest_cid_name=Ronald&dest_cid_number=7863342521&src=55555&dest=7863342521&auto_answer=true&rec=false&ringback=us-ring', {},{'rejectUnauthorized':false}, function(err, response, data){log(err);log(response);log(data);});
            
			/*originateB24Call(req.body, cache, (err, data) => {
                if (err) {
                    log(err);
                    res.json({
                        status: '500',
                        message: err
                    });
                    return;
                }

                log('Originate result: ' + data);
                res.json({
                    status: '200',
                    message: data
                });
            });*/
			
			res.json({
                    status: '200',
                    message: req.query
            });
        });

        restHTTPServer.all('/*', (req, res) => {
            res.json({
                status: '200',
                message: 'PONG'
            });
        });

        restHTTPServer.use(function(err, req, res, next) {
            log('restHTTPServer Error: ' + err);
            res.json({
                status: '500',
                message: err && err.message
            });
        });
		//https://155.138.227.120/app/click_to_call/click_to_call.php?src_cid_name=55555&src_cid_number=55555&dest_cid_name=Ronald&dest_cid_number=7863342521&src=55555&dest=7863342521&auto_answer=true&rec=false&ringback=us-ring
        restHTTPServer.listen(restConfig.port, () => {
            log('Click2Call service listening on /rest/1/' + restConfig.entryPoint + ':' + restConfig.port);
        });
    }

    log('Bitrix24 - Freeswitch daemon started');
} else {
    log('Bitrix24 URL is not specified, exiting');
}