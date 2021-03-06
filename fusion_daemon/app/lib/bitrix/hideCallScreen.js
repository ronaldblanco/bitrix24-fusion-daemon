const log = require('app/init/logger')(module),
    request = require('urllib');

let hideCallScreen = (bitrix24Info, cache, callback) => {

    // Get all showCallScreens from cache

    let usersWatchingScreen = cache.get('showscreen_' + bitrix24Info['b24uuid']);

    if (!usersWatchingScreen) {
        log('No users are watching this call, skipping...');
        callback(null);
        return;
    }
    try {
        usersWatchingScreen = JSON.parse(usersWatchingScreen);
    } catch (e) {
        callback(e);
        return;
    }

    usersWatchingScreen.forEach((user) => {
        if (user !== bitrix24Info['userID']) {

            let requestURL = bitrix24Info['url'] + "/telephony.externalcall.hide?"
                + "USER_ID=" + user
                + "&CALL_ID=" + bitrix24Info['b24uuid'];
            
            request.request(requestURL, (err) => {
                if (err) {
                    log(err);
                }
            });
        }
    });

    callback(null);
}

module.exports = hideCallScreen;