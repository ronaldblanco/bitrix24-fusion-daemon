module.exports = {
    host: (typeof process.env.ESL_HOST === 'undefined') ? '127.0.0.1' : process.env.ESL_HOST,
    port: (typeof process.env.ESL_PORT === 'undefined') ? 8021 : process.env.ESL_PORT,
    password: (typeof process.env.ESL_PASSWORD === 'undefined') ? 'ClueCon' : process.env.ESL_PASSWORD,
    reconnect_seconds: 3,
    subscription: ['CHANNEL_CREATE', 'CHANNEL_ANSWER', 'CHANNEL_HANGUP', 'CHANNEL_PROGRESS' ,'CHANNEL_BRIDGE', 'CHANNEL_DESTROY'],
    hangupCause: {
        "UNALLOCATED_NUMBER": "404",
        "USER_BUSY": "486",
        "NO_USER_RESPONSE": "408",
        "NO_ANSWER": "480",
        "SUBSCRIBER_ABSENT": "480",
        "CALL_REJECTED": "603",
        "DESTINATION_OUT_OF_ORDER": "502",
        "INVALID_NUMBER_FORMAT": "484",
        "NORMAL_TEMPORARY_FAILURE": "503",
        "SWITCH_CONGESTION": "503",
        "INCOMPATIBLE_DESTINATION": "488",
        "RECOVERY_ON_TIMER_EXPIRE": "504",
        "ORIGINATOR_CANCEL": "487",
        "NORMAL_CLEARING": "200"
    }
};