function gameEndHandler()
{
	console.log("sdafsd");
	var scores = document.getElementsByName('score');
	for(var i=0;i<scores.length;i++)
	{
		scores[i].innerHTML = players[i].score;
		console.log(players[i].score);
	}
	
	$(".inline").click();
}

function init(value)
{
	client_index = value;
	//console.log("The client_index for init() is: " + client_index);
	$(".inline").colorbox({inline:true, width:"50%"});
	//-------------game init---------
	if(network)
		game.init(onSocketConnected,onSocketDisconnect,onSocketMessage,onChangeClientIndex);
	//--------------------------------

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
					console.log("fail");
			}
			else
				alert("This is player[" + game.token_index + "]'s round!");
	}, false);

	canvas.addEventListener('mousemove', function(e) {
	        var mousePos = getMousePos(canvas, e);
			topLayerView_transform(canvas,mousePos,tile,players[client_index].id)
	}, false);

//danny change
/*-------------Socket IO-------------------------*/
	function onSocketConnected() {
		console.log('Client['+ client_index +'] has connected to the server!');
	};

	function onSocketDisconnect() {
		console.log("Disconnected from the socket server");
	};

	function onSocketMessage(msg){
		//{status:next/empty/end,data:{playerID:playerID,tile:tile,tile_index:tile_index,mouse_co:mouse_co}}
		//var msg = JSON.parse(msgJSON); //no need to parse JSON data  ,since already did it inside
		console.log("Entered!!!");
		console.log(JSON.stringify(msg));
		console.log(msg);
		if(msg.status == "next")
		{
			if((game.token_index==msg.data.playerIndex))	//danny- change
			{
				if(players[game.token_index].nextTile(msg.data.tile,msg.data.mouse_co))
				{
					console.log("hiihihi");			
					viewRefresh(canvas);
					players[game.token_index].removeTile(msg.data.tile_index);
					game.nextToken(network);
				}
			}
		}
		else if(msg.status == "empty")
		{
			
		}
		else if(msg.status == "end")
		{
			
		}
	};

	function onChangeClientIndex(msg){
		console.log("Entered in onChangeClientIndex! Yeah! And the client_index is: " + msg);
		client_index = msg;
	}

	console.log('init');
	//-------------game init---------
	/*if(network)
		game.init(onSocketConnected,onSocketDisconnect,onSocketMessage,onChangeClientIndex);*/
	//--------------------------------
	/*--------------END------------------------------*/

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
client_socket = io.connect(websocket_server_domain, {port: websocket_server_port, transports: ["websocket"]});
client_socket.on('client_index',function(msg){console.log("client_index in function is: " + msg); client_index=msg; init(client_index)});
//window.addEventListener("load",init,false);