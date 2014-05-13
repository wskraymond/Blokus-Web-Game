function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
}

function getCellCoordinate(mouse_coordinate)
{
	return {x:Math.floor(mouse_coordinate.x/(game.cell_size+game.border_size*2)), y:Math.floor(mouse_coordinate.y/(game.cell_size+game.border_size*2))};
}

function rotateTile(direction,tile,canvas)
{
	if(tile!=null)
	{
		var w = tile.w;
		var h = tile.h;
	
		for(var i=0;i<tile.cells.length;i++)
		{
			var x = tile.cells[i].x;
			var y = tile.cells[i].y;
		
			//Matrix Rotation
			if(direction==="cw")
			{
				tile.cells[i].x = (h-1) + x * 0 - y*1; 
				tile.cells[i].y = x * 1 + y*0;
			}
			else if(direction==="counter_cw")
			{
				tile.cells[i].x = x * 0 - y*(-1); 
				tile.cells[i].y = (w-1) + x*(-1) + y*0;
			}
		}
		//swap the width & height
		tile.w = h;
		tile.h = w;
	
		//view update
		postureViewUpdate(canvas,tile);
	}
}

function mirrorTile(direction,tile,canvas)
{
	if(tile!=null)
	{
		for(var i=0;i<tile.cells.length;i++)
		{
			//Matrix Mirror
			if(direction==='y')
				tile.cells[i].y = (tile.h - 1) - tile.cells[i].y;
			else if(direction==='x')
				tile.cells[i].x = (tile.w - 1) - tile.cells[i].x;	
		}
		//view update
		postureViewUpdate(canvas,tile);
	}
}

function pickTile(mouse_co,canvas,player)
{
	var focus_co = getCellCoordinate(mouse_co);
	var w=0;
	for(var i =0;i<player.tiles_set.length;i++)
	{
		w+=player.tiles_set[i].w+1;
		if(focus_co.x<w-1)
		{
			tile = jQuery.extend(true, {}, player.tiles_set[i]);
			tile_index = i;
			break;
		}
	}
	postureViewUpdate(canvas,tile);
}

//Class Player
function Player(id)
{
	//private
	
	//public
	var player = this;
	player.id = id;
	player.score = 0;
	player.stop = false;
	player.tiles_set = jQuery.extend(true, [], tiles_set);	//copy array => []
		
	player.send = function(status,tile,tile_index,mouse_co){
		if(status=='next')
			//danny- change
			client_socket.emit('nextTile', { status:"next",data:{playerIndex:client_index,tile:tile, tile_index:tile_index, mouse_co:mouse_co} });
		else
			client_socket.emit('nextTile', {status:"empty",data:{playerIndex:client_index}});//Raymond's change
	};
	
	player.removeTile = function(ptile_index){
		if(ptile_index!=null)
		{
			player.tiles_set.splice(ptile_index, 1);
		}
		else
		{
			player.tiles_set.splice(tile_index, 1);
			//reset to null
			tile = null;
			tile_index = null;
		}
	}
	function getScore(tile){
		//normal
		if(tile.cells.length!=null)
			player.score += tile.cells.length;
		else
			console.log('sadf');
		
		//bonus marks
		if(player.tiles_set.length == 1)
		{
			player.score += 15;
			if(tile.length == 1)
				player.score += 20;
		}
			
	};
	player.nextTile = function(tile,mouse_co){
		if(tile!=null)
		{
			var focus_co = getCellCoordinate(mouse_co);
			var error;
			if((error=game.setTile(player.id,tile,focus_co))===true)
			{
				getScore(tile);
				game.setHint();
				return true;
			}
			console.log('Failure to place:'+error);
			return false;
		}
		else
			alert("Pick a tile first");
		return false;
	}
}