function game(boardview, scoreview, nextview)
{
    function rnd1to9()
    {
	return Math.ceil(Math.random()*9);
    }

    var boardview = boardview;
    var scoreview = scoreview;
    var nextview = nextview;
    var score = 0;
    var board = [];
    var rows = 23;
    var cols = 6;
    var next = rnd1to9();
    var current = rnd1to9();

    for(var col = 0; col < cols; col++)
    {
	board.push([]);
	for(var row = 0; row < rows; row++)
	{
	    board[col].push(-1);
	}
    }

    function start()
    {
	draw();
    }

    this.start = start;

    function draw()
    {
	nextview.textContent = next;
	scoreview.textContent = score;
	for(var col = 0; col < cols; col++)
	{
	    for(var row = 0; row < rows; row++)
	    {
		if(board[col][row] != -1)
		{
		    boardview.rows[row].cols[col].textContent = board[col][row];
		}
	    }
	}
	
    }

}