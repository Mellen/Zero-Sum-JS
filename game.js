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
	    board = []

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
	    next = rndval();

	    draw();
	    step();
    }

    this.start = start;

    function stop()
    {
	    cancelTimeout(this.timer);
	    playing = false;
    }

    this.stop = stop;

    function nextIsNotEmpty()
    {
	    return board[current.col][current.row+1] != empty;
    }

    function checkForZeroSum()
    {
	    var recheck = false;
	    var rowsToCollapse = [];
	    var colsToCollapse = [];

	    for(var col = 0; col < cols; col++)
	    {
	        var nextColCollapse = {start:0, end:0, col:col};
	        var colTotal = 0;
	        var colCellsChecked = 0;
	        for(var row = 0; row < rows; row++)
	        {
		        var val = board[col][row];
		        if(val != empty && val != block)
		        {
		            colTotal += val;
		            colCellsChecked++;
		        }

                if((val == block || row == (rows -1)) && colTotal == 0 && colCellsChecked > 0)
                {
                    recheck = true;
                    score += 2 * (colCellsChecked -1)
                    if(val == block)
                    {
                        nextColCollapse.end = row -1 ;
                    }
                    else
                    {
                        nextColCollapse.end = row;
                    }
                    colsToCollapse.push(nextColCollapse);
                    if(val == block)
                    {
                        nextColCollapse = {start:row + 1, end:0, col: col};
                    }
                }

                if(val == block)
                {
                    colCellsChecked = 0;
                    colTotal = 0;
                }

                if(col != 0)
                {
                    continue;
                }

                var rowTotal = 0;
                var rowCellsChecked = 0;
                var nextRowCollapse = {start:0, end:0, row: row};
                for(var rowcol = 0; rowcol < cols; rowcol++)
                {
                    var valrow = board[rowcol][row];
                    if(valrow != empty && valrow != block)
                    {
                        rowTotal += valrow;
                        rowCellsChecked++;
                    }

                    if((valrow == block || valrow == empty || rowcol == (cols - 1)) && rowTotal == 0 && rowCellsChecked > 0)
                    {
                        recheck = true;
                        score += 2 * (rowCellsChecked - 1);
                        if(valrow == block || valrow == empty)
                        {
                            nextRowCollapse.end = rowcol - 1;
                        }
                        else
                        {
                            nextRowCollapse.end = rowcol;
                        }
                        rowsToCollapse.push(nextRowCollapse);
                        if(valrow == block || valrow == empty)
                        {
                            nextRowCollapse = {start:rowcol + 1, end:0, row: row}; 
                        }
                    }

                    if(valrow == block || valrow == empty)
                    {
                        rowCellsChecked = 0;
                        rowTotal = 0;
                    }
                }
            }
	    }

        for(var index = 0; index < colsToCollapse.length; index++)
        {
            var item = colsToCollapse[index];
            for(var row = item.start; row <= item.end; row++)
            {
                board[item.col][row] = empty;
            }
        }

        for(var index = 0; index < rowsToCollapse.length; index++)
        {
            var item = rowsToCollapse[index];
            for(var col = item.start; col <= item.end; col++)
            {
                board[col][item.row] = empty;
            }
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
            checkForZeroSum();
            checkForGameOver();
            current.val = next;
            current.row = 0;
            current.col = rndcol();
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