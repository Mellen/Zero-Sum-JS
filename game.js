function game(boardview, scoreview, nextview)
{
    function rndval()
    {
	var sign = -1;
	
    	if(Math.random() > 0.5)
	{
	    sign = 1;
	}

	return sign*Math.ceil(Math.random()*5);
    }

    function rndcol()
    {
	return Math.floor(Math.random()*cols);
    }

    var empty = 6;
    var block = 0;
    var min = -5;
    var max = 5;
    var boardview = boardview;
    var scoreview = scoreview;
    var nextview = nextview;
    var score = 0;
    var board = [];
    var rows = 13;
    var cols = 6;
    var next = 0;
    var current = {row:0, col:0, val:0};
    var playing = false;

    for(var row=0; row < rows; row++)
    {
	var newrow = boardview.insertRow();
	for(var cell = 0; cell < cols; cell++)
	{
	    newrow.insertCell();
	}
    }


    function start()
    {
	stop();
	board = [];
	
	for(var col = 0; col < cols; col++)
	{
	    board.push([]);
	    for(var row = 0; row < rows; row++)
	    {
		board[col].push(empty);
	    }
	}
	
	score = 0;
	playing = true;
	current.val = rndval();
	current.col = rndcol();
	current.row = 0;
	next = rndval();
	
	draw();
	step();
    }
    
    this.start = start;
    
    function stop()
    {
	clearTimeout(this.timer);
	playing = false;
    }
    
    this.stop = stop;

    function move(direction)
    {
	if(playing && (current.col + direction) >= 0 && (current.col + direction) < cols)
	{
	    if(board[current.col + direction][current.row] == empty)
	    {
		board[current.col][current.row] = empty;
		current.col += direction;
		board[current.col][current.row] = current.val;
		draw();
	    }  
	}
    }

    this.move = move;
    
    function nextIsNotEmpty()
    {
	return board[current.col][current.row+1] != empty;
    }
    
    function checkForZeroSum()
    {
	var recheck = false;
	var cellsToCollapse = [];
	var valsum = 0;
	var ctc = [];
	var rtc = [];
	var scoreinc = 0;
	
	for(var col = 0; col < cols; col++)
	{
	    ctc = []
	    valsum = 0;
	    for(var row = 0; row < rows; row++)
	    {
		if(board[col][row] != block && board[col][row] != empty)
		{
		    valsum += board[col][row];
		    ctc.push({col:col, row:row});
		}
		else
		{
		    valsum = 0;
		    ctc = []
		}
	    }
	    if(valsum == 0)
	    {
		scoreinc = (ctc.length*(ctc.length - 1))/2
		for(var index in ctc)
		{
		    cellsToCollapse.push(ctc[index]);
		}
		score += scoreinc;
		if(scoreinc > 0)
		{
		    recheck = true;
		}
	    }
	}

	for(var row = 0; row < rows; row++)
	{
	    rtc = []
	    valsum = 0;
	    for(var col = 0; col < cols; col++)
	    {
		if(board[col][row] != block && board[col][row] != empty)
		{
		    valsum += board[col][row];
		    rtc.push({col:col, row:row});
		}
		else if (valsum == 0 && rtc.length != 0)
		{
		    scoreinc = (rtc.length*(rtc.length - 1))/2
		    for(var index in rtc)
		    {
			cellsToCollapse.push(rtc[index]);
		    }
		    score += scoreinc;
		    rtc = []
		    recheck = true;
		}
		else
		{
		    valsum = 0;
		    rtc = [];
		}
	    }
	    if(valsum == 0)
	    {
		scoreinc = (rtc.length*(rtc.length - 1))/2
		for(var index in rtc)
		{
		    cellsToCollapse.push(rtc[index]);
		}
		score += scoreinc;
		if(scoreinc > 0)
		{
		    recheck = true;
		}
	    }
	}

        for(var index = 0; index < cellsToCollapse.length; index++)
        {
            var item = cellsToCollapse[index];
	    board[item.col][item.row] = empty;
        }

        for(var col = 0; col < cols; col++)
        {
            var lastEmpty = board[col].lastIndexOf(empty);
            var indexNotEmpty = board[col].indexOf(min);
            for(var val = min+1; val <= max; val++)
            {
                var curIndex = board[col].indexOf(val);
                if(curIndex < indexNotEmpty)
                {
                    indexNotEmpty = curIndex;
                }
            }
            if(indexNotEmpty < lastEmpty)
            {
                for(var row = lastEmpty - 1; row >= 0; row--)
                {
                   board[col][row+1] = board[col][row];
                   board[col][row] = empty;
                }
            }
        }

        return recheck;
    }

    function checkForGameOver()
    {
	if(board[current.col][0] != empty)
	{
	    playing = false;
	    alert("Game over!");
	}
    }

    function step()
    {
        var stop = false;
        board[current.col][current.row] = empty;
        if(((current.row + 1) == rows) || (nextIsNotEmpty()))
        {
            stop = true;
        }

        if(!stop)
        {
            current.row += 1;
        }
        else
        {
            board[current.col][current.row] = current.val;
	    var recheck = true;
	    while(recheck)
	    {
		recheck = checkForZeroSum();
	    }
            current.col = rndcol();
            checkForGameOver();
            current.val = next;
            current.row = 0;
            next = rndval();
        }

        board[current.col][current.row] = current.val;
        draw();
        if(playing)
        {
            this.timer = setTimeout(step, 500);
        }
    }

    function draw()
    {
        nextview.textContent = next;
        scoreview.textContent = score;
        for(var col = 0; col < cols; col++)
        {
            for(var row = 0; row < rows; row++)
            {
		var val = board[col][row];
		if(val > 0)
		{
                    val = '+'+val.toString();
		}
		else if(val == 0)
		{
                    val = '00';
		}
		
		boardview.rows[row].cells[col].textContent = val;
		
		if(board[col][row] == empty)
		{
                    boardview.rows[row].cells[col].className = 'empty';
		}
		else if (board[col][row] == block)
		{
                    boardview.rows[row].cells[col].className = 'block';
		}
		else
		{
                    boardview.rows[row].cells[col].className = '';
		}
            }
        }
    }

}