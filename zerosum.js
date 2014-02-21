var boardview = document.getElementById('board');
var scoreview = document.getElementById('score');
var nextview = document.getElementById('nextnumber');

var zsgame = new game(boardview, scoreview, nextview);

zsgame.start();