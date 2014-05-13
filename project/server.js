/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io");				// Socket.IO


/**************************************************
** GAME VARIABLES
**************************************************/
var socket;		// Socket controller
var client_index = 0;

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Set up Socket.IO to listen on port 8000
	socket = io.listen(8000);

	// Configure Socket.IO
	socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: " + client.id);
	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("nextTile", onNewPlayer);

	client.on("client_index", onChangeClientIndex);
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);
	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(msg) {
	// Broadcast new player to connected socket clients
	util.log("Yeah!");
	util.log("msg is: " + msg);
	util.log(msg.status + " "  + msg.data);
	if(msg.status == "next"){
		util.log(msg.data.tile);
		util.log(JSON.stringify(msg.data));
	}
	//{ status:"next",data:{tile:tile, tile_index:tile_index, mouse_co:mouse_co} }
	this.broadcast.emit("message", msg);
	//this.broadcast.emit("message", {status:msg.status});
};

function onChangeClientIndex(msg){
	this.emit("client_index", client_index);
	util.log("The client_index is: " + client_index);
	client_index++;
	client_index = client_index % 4;
}
/**************************************************
** RUN THE GAME
**************************************************/
init();