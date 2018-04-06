var PORT =process.env.PORT || 3000;
var moment = require('moment');
var express =require('express');
var app = express();
var http =require('http').Server(app);
var io =require('socket.io')(http);
app.use(express.static(__dirname + '/public'));
var clientInfo ={};
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function (socket){
	console.log('user connected via socket.io!');
	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id];

		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.group).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});
	socket.on('joingroup',function(req){
		clientInfo[socket.id]=req;
		socket.join(req.group);
		socket.broadcast.to(req.group).emit('message',{
			name:'system',
			text: req.name  + ' has joined',
			timestamp:moment().valueOf()
		});

	});
	socket.on('message', function(message){
		console.log('message recieved' + message.text);
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else{
        message.timestamp = moment().valueOf();
		io.to(clientInfo[socket.id].group).emit('message',message);
	}
	});

	socket.emit('message', {
		name: 'System',
		text: 'welcome to chat!',
		timestamp:moment().valueOf()
	});
});


http.listen(PORT, function(){
	console.log('Server started!');
});