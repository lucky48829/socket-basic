var name = getQueryVariable('name') || 'Anonymous';
var group = getQueryVariable('group');

var socket = io();
console.log(name  +  'wants to join' + group);
jQuery('.group-name').text(group);

socket.on('connect', function(){
	console.log('connected to socket.io server!');
    socket.emit('joingroup',{
    	name:name,
    	group:group
    })  

});

socket.on('message', function(message){
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');
	console.log('new message');
	console.log(message.text);
	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
});




var forms =jQuery('#message-form');
forms.on('submit', function(event){
	event.preventDefault();

    var  $message = forms.find('input[name=message]');  
	socket.emit('message',{
		name: name,
		text: $message.val()
	});

	$message.val('');

});

var formsq =jQuery('#message--form');

formsq.on('submit',function(event){
event.preventDefault();
socket.emit('message',{
		
		text: '@currentUsers'
	});

});

