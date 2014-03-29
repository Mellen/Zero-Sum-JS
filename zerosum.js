var boardview = document.getElementById('board');
var scoreview = document.getElementById('score');
var nextview = document.getElementById('nextnumber');

var zsgame = new game(boardview, scoreview, nextview);

var startButton = document.getElementById('start');

startButton.addEventListener('click', function()
			     { 
				 zsgame.stop();
				 zsgame.start(); 
			     });

addEventListener('keyup', function(e)
		 {
		     if(e.keyCode == 39)
		     {
			 zsgame.move(1);
		     }
		     else if(e.keyCode == 37)
		     {
			 zsgame.move(-1);
		     }
		 });