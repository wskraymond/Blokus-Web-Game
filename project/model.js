function cell(j,i)
{
	return {x:j,y:i};
}

//Tile
var tile1 = {w:1,h:1,cells:[cell(0,0)]};
var tile2 = {w:2,h:1,cells:[cell(0,0),cell(1,0)]};
var tile3 = {w:2,h:2,cells:[cell(0,0),cell(1,0),cell(1,1)]};
var tile4 = {w:3,h:1,cells:[cell(0,0),cell(1,0),cell(2,0)]};
var tile5 = {w:2,h:2,cells:[cell(0,0),cell(1,0),cell(0,1),cell(1,1)]};
var tile6 = {w:3,h:2,cells:[cell(1,0),cell(0,1),cell(1,1),cell(2,1)]};
var tile7 = {w:4,h:1,cells:[cell(0,0),cell(1,0),cell(2,0),cell(3,0)]};
var tile8 = {w:3,h:2,cells:[cell(0,1),cell(1,1),cell(2,1),cell(2,0)]};
var tile9 = {w:3,h:2,cells:[cell(1,0),cell(2,0),cell(0,1),cell(1,1)]};
var tile10 = {w:4,h:2,cells:[cell(0,0),cell(0,1),cell(1,1),cell(2,1),cell(3,1)]};
var tile11 = {w:3,h:3,cells:[cell(1,0),cell(1,1),cell(1,2),cell(0,2),cell(2,2)]};
var tile12 = {w:3,h:3,cells:[cell(0,0),cell(0,1),cell(0,2),cell(1,2),cell(2,2)]};
var tile13 = {w:4,h:2,cells:[cell(0,1),cell(1,1),cell(1,0),cell(2,0),cell(3,0)]};
var tile14 = {w:3,h:3,cells:[cell(2,0),cell(0,1),cell(1,1),cell(2,1),cell(0,2)]};
var tile15 = {w:5,h:1,cells:[cell(0,0),cell(1,0),cell(2,0),cell(3,0),cell(4,0)]};
var tile16 = {w:2,h:3,cells:[cell(0,0),cell(0,1),cell(1,1),cell(0,2),cell(1,2)]};
var tile17 = {w:3,h:3,cells:[cell(0,1),cell(0,2),cell(1,0),cell(1,1),cell(2,0)]};
var tile18 = {w:2,h:3,cells:[cell(0,0),cell(1,0),cell(0,1),cell(0,2),cell(1,2)]};
var tile19 = {w:3,h:3,cells:[cell(1,0),cell(2,0),cell(0,1),cell(1,1),cell(1,2)]};
var tile20 = {w:3,h:3,cells:[cell(1,0),cell(0,1),cell(1,1),cell(2,1),cell(1,2)]};
var tile21 = {w:4,h:2,cells:[cell(1,0),cell(0,1),cell(1,1),cell(2,1),cell(3,1)]};

//var tile12 = [cell(0,0),cell(0,0),cell(0,0),cell(0,0),cell(0,0)];
var tiles_set = [tile1,tile2,tile3,tile4,tile5,tile6,tile7,tile8,tile9,tile10,tile11,tile12,tile13,tile14,tile15,tile16,tile17,tile18,tile19,tile20,tile21];

//Class Board
function Game(number_cells,board_size,border_size)
{
	//private
	var player_p = /P/i;
	//public
	var game = this;
	
	game.token_index = 0;		//the person who hold the game
	game.pass_num = 0;
	game.nextToken = function(online){		
		var counter = 0;
		do{
			game.token_index++;
			game.token_index%=4;
			counter++;
		}while(players[game.token_index].stop && counter<4);
		
		if(!online)	//no network, single PC version
			client_index = game.token_index;
	}	
	/*----------------------------------Raymond's change---------------------------------------*/
	game.init = function(onSocketConnected,onSocketDisconnect,onSocketIndex,onSocketMessage){
		client_socket = io.connect(websocket_server_domain, {port: websocket_server_port, transports: ["websocket"]});
		// Add Event listeners
		if(onSocketConnected)
			client_socket.on('connect',onSocketConnected);
		else
			console.log("no onSocketConnected");

		if(onSocketIndex)
			client_socket.on('clientIndex',onSocketIndex);
		else
			console.log("no onSocketIndex");

		if(onSocketDisconnect)
			client_socket.on('disconnect',onSocketDisconnect);
		else
			console.log("no onSocketDisconnect");

		if(onSocketMessage)
			client_socket.on('message',onSocketMessage);
		else
			console.log("no onSocketMessage");
	};
	/*----------------------------------------------------------------------------------------*/
	
	game.isGameEnd = function(){
		if(game.pass_num>=4)
			return true;
		else
			return false;
	};
	
	game.board_size = board_size;
	game.border_size = border_size;
	game.number_cells = number_cells;
	game.cell_size = board_size/number_cells - border_size*2;
	game.board = new Array(number_cells);
	for(var i=0;i<game.board.length;i++)
	{
		game.board[i] = new Array(number_cells);
		for(var j=0;j<game.board[i].length;j++)
		{
			// John's comment: I switched the condition of H3 & H4, so that the game flow becomes clockwise
			if(i==0&&j==0)
				game.board[i][j] = 'H1';
			else if(i==0&&j==game.number_cells-1)
				game.board[i][j] = 'H2';
			else if(i==game.number_cells-1&&j==game.number_cells-1)
				game.board[i][j] = 'H3';
			else if(i==game.number_cells-1&&j==0)
				game.board[i][j] = 'H4';
			else
				game.board[i][j] = 'B';
		}
	}
	function isEdge(pid,i,j)
	{
		if(game.board[i][j] == pid)
			return true;
		else
			return false;
	}
	
	function CheckAllEdge(pid,i,j)
	{
		//set edges
		if(i-1>=0)
			if(isEdge(pid,i-1,j))
				return false;
		if(i+1<=game.number_cells-1)
			if(isEdge(pid,i+1,j))
				return false;
		
		if(j-1>=0)
			if(isEdge(pid,i,j-1))
				return false;
		if(j+1<=game.number_cells-1)
			if(isEdge(pid,i,j+1))
				return false;
		
		return true;	//valid cell to be occupied
	}
	
	game.setTile = function(pid,tile,focus_co){
		var hid = pid.replace(player_p, "H");
		var h_p = new RegExp(hid,'i');
		var has_valid_corner = false;
		//boudary check
		if( (game.number_cells - focus_co.x) >= tile.w && (game.number_cells - focus_co.y ) >= tile.h )
		{
			
			//filtering
			for(var i=0;i<tile.cells.length;i++)
			{
				//collision detection
				//console.log("y:" + tile.cells[i].y + " " + focus_co.y + " x:" + tile.cells[i].x + " " + focus_co.x);
				if(!player_p.test(game.board[tile.cells[i].y + focus_co.y][tile.cells[i].x + focus_co.x]))
				{
					//only corner-to-corner contact allowed, edges cannot touch.
					if(CheckAllEdge(pid,tile.cells[i].y + focus_co.y,tile.cells[i].x + focus_co.x))	//true -> edges not touch.
					{
						if(h_p.test(game.board[tile.cells[i].y + focus_co.y][tile.cells[i].x + focus_co.x]))
							has_valid_corner = true;
					}
					else
						return 1;
				}
				else
					return 2;
			}
			
			//setting
			if(has_valid_corner)
			{
				for(var i=0;i<tile.cells.length;i++)
					game.board[tile.cells[i].y + focus_co.y][tile.cells[i].x + focus_co.x] = pid; //set it
				return true;
			}
			else
				return 3;
		}
		else 
			return 4; 
		return 5; 
	};

	/*
	only corner-to-corner contact allowed—edges cannot touch.
	*/
	function setOneCorner(hid,i,j)
	{
		var h_p = new RegExp(hid,'i');
		if(!player_p.test(game.board[i][j]))
		{
			if(game.board[i][j]=='B')
				game.board[i][j] = hid;
			else if(!h_p.test(game.board[i][j]))	//That is 'H*' but no hid
				game.board[i][j] += hid;	//multi-occupy
		}
	}
	
	function resetOneCorner(hid,i,j)
	{
		var h_p = new RegExp(hid,'i');
		if(!player_p.test(game.board[i][j]))
		{
			if(h_p.test(game.board[i][j]))	//That contains hid
			{
				game.board[i][j] = game.board[i][j].replace(hid,'');	//remove one hid
				game.board[i][j] = (game.board[i][j]=='') ? 'B' : game.board[i][j];	//if empty, reset to 'B'
			}
		}
	}
	function setHintByCell(pid,i,j)
	{
		var hid = pid.replace(player_p, "H");
		//setCorner
		if(i-1>= 0)
		{
			if(j-1>=0)
				if(CheckAllEdge(pid,i-1,j-1))
					setOneCorner(hid,i-1,j-1);
				else
					resetOneCorner(hid,i-1,j-1);

			if(j+1<=game.number_cells-1)
				if(CheckAllEdge(pid,i-1,j+1))
					setOneCorner(hid,i-1,j+1);
				else
					resetOneCorner(hid,i-1,j+1);
		}
		
		if(i+1<=game.number_cells-1)
		{
			if(j-1>=0)
				if(CheckAllEdge(pid,i+1,j-1))
					setOneCorner(hid,i+1,j-1);
				else
					resetOneCorner(hid,i+1,j-1);

			if(j+1<=game.number_cells-1)
				if(CheckAllEdge(pid,i+1,j+1))
					setOneCorner(hid,i+1,j+1);
				else
					resetOneCorner(hid,i+1,j+1);
				
		}	
	}

	game.setHint = function(){
		for(var i = 0;i<game.number_cells; i++)
		{
			for(var j = 0;j<game.number_cells; j++)
			{
				 if(player_p.test(game.board[i][j]))
					setHintByCell(game.board[i][j],i,j);
			}
		}
	};
}
