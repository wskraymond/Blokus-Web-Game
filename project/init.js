function showNotificationBar(message, duration, bgColor, txtColor, height) {
 
    /*set default values*/
    duration = typeof duration !== 'undefined' ? duration : 1500;
    bgColor = typeof bgColor !== 'undefined' ? bgColor : "#F4E0E1";
    txtColor = typeof txtColor !== 'undefined' ? txtColor : "#A42732";
    height = typeof height !== 'undefined' ? height : 40;
    /*create the notification bar div if it doesn't exist*/
    if ($('#notification-bar').size() == 0) {
        var HTMLmessage = "<div class='notification-message' style='text-align:center; line-height: " + height + "px;'> " + message + " </div>";
        $('body').prepend("<div id='notification-bar' style='display:none; width:100%; height:" + height + "px; background-color: " + bgColor + "; position: fixed; z-index: 100; color: " + txtColor + ";border-bottom: 1px solid " + txtColor + ";'>" + HTMLmessage + "</div>");
    }
    /*animate the bar*/
    $('#notification-bar').slideDown(function() {
        setTimeout(function() {
            $('#notification-bar').slideUp(function() {});
        }, duration);
    });
}

function updateStatus()
{
	if(network)
	{
		document.getElementById('status').innerHTML = "Player: " + (client_index + 1) + " current score: " + players[client_index].score;
		$("#status").attr('class', colorClass[client_index]);
	}
	else
	{
		document.getElementById('status').innerHTML = "Player: " + ((client_index + 1)%4 + 1) + " current score: " + players[client_index].score;
		$("#status").attr('class', colorClass[(client_index+1)%4]);
	}
}

function gameEndHandler()
{
	var scores = document.getElementsByName('score');
	for(var i=0;i<scores.length;i++)
	{
		scores[i].innerHTML = players[i].score;
		console.log(players[i].score);
	}
	
	$(".inline").click();
}

function getNetworkMode()
{
	network = $.cookie(network_cookie);
	if(network!=null)
	{
		network = JSON.parse(network);
		if(network)
			console.log("online mode");
		else
		{
			client_index = 0;
			console.log("offline mode");
			updateStatus();
		}
	}
	else
		alert("Network Mode error");
	
	//debug
	network = false;
	client_index = 0;
}

function init()
{

$("#frame1").fadeIn();		//for use frame2

getNetworkMode();

$(".inline").colorbox({inline:true, width:"50%"});

var canvas = document.getElementById("boardCanvas");
var ctx = canvas.getContext("2d");

//initialization
ctx.rect(0, 0, game.board_size, game.board_size);
ctx.lineWidth = 1;
ctx.strokeStyle = '#669966';
ctx.stroke();

viewRefresh(canvas);

canvas.addEventListener('click', function(e) {
        var mousePos = getMousePos(canvas, e);
		if(game.token_index==client_index)
		{
			if(players[client_index].nextTile(tile,mousePos))
			{
				viewRefresh(canvas);
				
				//send to server
				if(network)
					players[client_index].send("next",tile,tile_index,mousePos);
			
				players[client_index].removeTile(null);
				game.nextToken(network);	//next player
				
				postureViewUpdate(canvas_posture,tile,players[client_index].id);
				pickerViewUpdate(canvas_picker,players[client_index]);
				
				console.log("success");
			}
			else
				showNotificationBar("Wrong placement!");
		}
		else
			alert("This is player[" + game.token_index + "]'s round!");
}, false);

canvas.addEventListener('mousemove', function(e) {
        var mousePos = getMousePos(canvas, e);
		topLayerView_transform(canvas,mousePos,tile,players[client_index].id)
}, false);

/*---------------Socket IO-------------*/
	function onSocketConnected() {
		console.log("all are connected!");
		
		$("#frame1").fadeOut("slow");
		$("#frame2").fadeIn(3000);
		updateStatus();
		//send cookies {session_key,..} to server to retrive playerIndex;
		/*
		if($.cookie(session_key_name))
		{
			client_socket.emit("cookies",{cookies:{sid:$.cookie(session_key_name)}});	//for server side to get, msg.cookies.sid ....
			console.log('cookies{'+ $.cookie(session_key_name) +'} has been sent to the server!');
		}
		else
			console.log("no value of name" + session_key_name);
		*/
	};
	
	/*
	function onSocketIndex(playerIndex)
	{
		console.log('PlayerIndex:' + playerIndex + 'has been received');
		client_index = playerIndex;
	}
	*/
	
	function onSocketDisconnect() {
		console.log("Disconnected from socket server");
	};
	
	function onSocketMessage(msg){
		//{status:next/empty/end,data:{playerID:playerID,tile:tile,tile_index:tile_index,mouse_co:mouse_co}}
		//var msg = JSON.parse(msgJSON); //no need to parse JSON data  ,since already did it inside
		
		if(msg.status == "next")
		{
			if((game.token_index==msg.data.playerIndex))
			{
				if(players[game.token_index].nextTile(msg.data.tile,msg.data.mouse_co))
				{
					viewRefresh(canvas);
					players[game.token_index].removeTile(msg.data.tile_index);
					game.nextToken(network);
				}
			}
			else
				onsole.log("Error: wrong playerIndex " + msg.data.playerIndex);
		}
		else if(msg.status == "empty")
		{
			if((game.token_index==msg.data.playerIndex))
			{
				game.pass_num++;
				players[game.token_index].stop = true;
				if(game.isGameEnd())
				{	
					gameEndHandler();
				}
				else
					game.nextToken(network);
			}
			else
				console.log("Error: wrong playerIndex " + msg.data.playerIndex);
		}
		else if(msg.status == "end")
		{
			
		}
	};
	//-------------game init---------
	if(network)
		game.init(onSocketConnected,onSocketDisconnect,onSocketIndex,onSocketMessage);
	//--------------------------------
/*---------------END-------------------*/

var canvas_posture = document.getElementById("posture");
var ctx_posture = canvas_posture.getContext("2d");
//initialization
ctx_posture.rect(0, 0, 150,150);
ctx_posture.lineWidth = 1;
ctx_posture.strokeStyle = '#669966';
ctx_posture.stroke();

postureViewUpdate(canvas_posture,tile,players[client_index].id);

document.getElementById("rotate_cw").addEventListener('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	rotateTile('cw',tile,canvas_posture);
},false);
document.getElementById("rotate_counter_cw").addEventListener('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	rotateTile('counter_cw',tile,canvas_posture);
},false);
document.getElementById("mirror_y").addEventListener('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	mirrorTile('y',tile,canvas_posture);
},false);
document.getElementById("mirror_x").addEventListener('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	mirrorTile('x',tile,canvas_posture);
},false);

document.getElementById("next").addEventListener('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	if(game.token_index==client_index)
	{
		game.pass_num++;
		if(game.isGameEnd())
		{
			gameEndHandler();
		}
		else
		{
			game.nextToken(network);	//next player		
		}
		
		postureViewUpdate(canvas_posture,tile,players[client_index].id);
		pickerViewUpdate(canvas_picker,players[client_index]);
		
		//send to server
		if(network)
			players[client_index].send("empty",null,null,null);
			
		players[client_index].stop = true;
	}
	else
		alert("This is player[" + game.token_index + "]'s round!");
},false);


var canvas_picker = document.getElementById("picker");
pickerViewUpdate(canvas_picker,players[client_index]);

canvas_picker.addEventListener('click', function(e) {
	e.preventDefault();
	e.stopPropagation();
	var mousePos = getMousePos(canvas_picker, e);
	pickTile(mousePos,canvas_posture,players[client_index]);
},false);

}

window.addEventListener("load",init,false);