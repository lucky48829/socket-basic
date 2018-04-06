var moment = require('moment');
var now = moment();


var timestamp = 1522913754;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.local().format('h:mm a')); // 11:06 am

