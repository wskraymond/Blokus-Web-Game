/*
The game is played on a square board divided into 20 rows and 20 columns, 
for a total of 400 squares.
*/
//configuration variable

/*-----------SocketIO----------------*/
var network = true; 	//multi-player connection version => set true , otherwise set false
var websocket_server_domain = "http://localhost";
var websocket_server_port = 8000;
var client_socket;
var session_key_name = "session_key";	//session key's cookie name //Raymond's change
/*------------------------------------*/

var tile;
var tile_index;
var client_index;//Danny's change
//Danny's change
if(!network)
	client_index = 0;
//default setting
//B for background color
//H for hints' color
//P* for Player color
var color_set = {'B':"#FF6600",'H1':"#CCCCFF",'H2':"#CCCCFF",'H3':"#CCCCFF",'H4':"#CCCCFF",'P1':"blue",'P2':"yellow",'P3':"red",'P4':"green"};

//Game(number_cells,board_size,border_size);
var game = new Game(20,450,1);
var players = [new Player('P1'),new Player('P2'),new Player('P3'),new Player('P4')];
var picker_height = game.board_size/game.number_cells *(3);
var picker_width = 0;

function set_picker_width_of(player)
{
	picker_width = 0;
	for(var i=0;i<player.tiles_set.length;i++)
	{
		picker_width += (game.board_size/game.number_cells)*player.tiles_set[i].w + (game.board_size/game.number_cells)*1;
	}
}
