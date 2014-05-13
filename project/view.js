/*------------------------------Raymond's change------------------------------*/
function viewRefresh(canvas)
{
	var context = canvas.getContext('2d');
	var hint_p = /H/i;
	var hid = 'H' + (client_index + 1);
	var h_p = new RegExp(hid,'i');
	for(var i=0,y=game.border_size ;i<game.number_cells;i++,y+= game.cell_size +  game.border_size*2)
	{
		for(var j=0,x=game.border_size ;j<game.number_cells;j++,x+=game.cell_size +  game.border_size*2)
		{
			if(hint_p.test(game.board[i][j]))
			{
				if(!network)
				{
					if(client_index!==null)
						context.fillStyle = color_set[hid];
					else
						context.fillStyle = color_set['B'];
				}
				else if(h_p.test(game.board[i][j]))
					context.fillStyle = color_set[hid];
				else
					context.fillStyle = color_set['B'];
			}
			else
				context.fillStyle = color_set[game.board[i][j]];

			context.fillRect(x,y,game.cell_size,game.cell_size);
		}
	}
}
/*--------------------------------------------------------------------------*/

function cellUpdate(canvas, clicked_coordinate) {
        var context = canvas.getContext('2d');
		var cell_coordinate = getCellCoordinate(clicked_coordinate);
        context.clearRect(cell_coordinate.x*(game.cell_size + game.border_size*2)+ game.border_size, cell_coordinate.y*(game.cell_size + game.border_size*2)+ game.border_size, game.cell_size, game.cell_size);
        context.fillStyle = '#CCCCFF';
		context.fillRect(cell_coordinate.x*(game.cell_size + game.border_size*2)+ game.border_size, cell_coordinate.y*(game.cell_size + game.border_size*2)+ game.border_size, game.cell_size, game.cell_size);
}

function topLayerView_transform(canvas,over_coordinate,tile,playerID)
{
	if(tile!=null)
	{
		var context = canvas.getContext('2d');
		var focus_coordinate = getCellCoordinate(over_coordinate);
		//if( (game.number_cells - focus_coordinate.x) >= tile.w && (game.number_cells - focus_coordinate.y ) >= tile.h )
		//{	
		viewRefresh(canvas);
		//update
		context.fillStyle = color_set[playerID];
		for(var i=0; i<tile.cells.length;i++)
		{
			context.fillRect((focus_coordinate.x + tile.cells[i].x)*(game.cell_size + game.border_size*2)+ game.border_size,(focus_coordinate.y + tile.cells[i].y)*(game.cell_size + game.border_size*2)+ game.border_size, game.cell_size, game.cell_size);
		}
		//}
	}
}

function postureViewUpdate(canvas,tile,playerID)
{
	var context = canvas.getContext('2d');
	//refresh context
	context.clearRect ( 0 , 0 , 150 , 150 );
	//initialization
	context.rect(0, 0, 150,150);
	context.lineWidth = 1;
	context.strokeStyle = '#669966';
	context.stroke();
	context.fillStyle = color_set[playerID];
	//update
	if(tile!=null)
	{
		for(var i=0; i<tile.cells.length;i++)
		{
			// John's comment: I have added a little code so that the tile would be displayed at the center of the posture view
			context.fillRect(tile.cells[i].x*(game.cell_size + game.border_size*2)+ game.border_size + (150-tile.w*game.cell_size)/2, tile.cells[i].y*(game.cell_size + game.border_size*2)+ game.border_size +  (150-tile.h*game.cell_size)/2, game.cell_size, game.cell_size);
		}
	}
}

function pickerViewUpdate(canvas,player)
{
	//recalculate
	set_picker_width_of(player);
	canvas.setAttribute("width",picker_width);
	canvas.setAttribute("height",picker_height);
	
	var ctx_picker = canvas.getContext("2d");
	
	//refresh context
	ctx_picker.clearRect ( 0 , 0 ,picker_width ,picker_height);
	
	//initialization
	ctx_picker.rect(0, 0, picker_width ,picker_height);
	ctx_picker.lineWidth = 1;
	ctx_picker.strokeStyle = '#669966';
	ctx_picker.stroke();
	ctx_picker.fillStyle = color_set[player.id];
	
	var x = 0;
	var y = 0;
	for(var i =0;i<player.tiles_set.length;i++)
	{
		for(var k=0; k<player.tiles_set[i].cells.length; k++)
		{
			ctx_picker.fillRect((x + player.tiles_set[i].cells[k].x)*(game.cell_size + game.border_size*2) + game.border_size, (y + player.tiles_set[i].cells[k].y)*(game.cell_size + game.border_size*2)+ game.border_size, game.cell_size, game.cell_size);
		}
		x += player.tiles_set[i].w + 1;
	}
}
