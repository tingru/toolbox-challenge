
$(document).ready(function() {
    var tiles =[];
    var idx;
    
    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
           tileNum: idx,
            src: 'img/tile' + idx + '.jpg'

        });
    }


    console.log(tiles);

    var shuffledTiles = _.shuffle(tiles);
    console.log(shuffledTiles);

    var selectedTiles = shuffledTiles.slice(0,8);  //none inclusive selection(0,'8')
    console.log(selectedTiles);

    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));
    });
    tilePairs = _.shuffle(tilePairs);

    console.log(tilePairs);

    var tileBack = 'img/tile-back.png';
    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function(tile, elemIndex) {
    if (elemIndex > 0 && 0 == elemIndex % 4) {
        gameBoard.append(row);
        row = $(document.createElement('div'));
    }


        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'image of tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);

    $('#game-board img').click(function() {
        var img = $(this);
        var tile = img.data('tile');
        img.fadeOut(100, function() {
            if(tile.flipped) {
                img.attr('src', 'tileBack');
            }
            else {
                 img.attr('src', tile.src);
             }
             tile.flipped = !tile.flipped;
             img.fadeIn(100);
         });//after fadeOut
     });//on click of gameboard images

    var startTime = _.now();
    var timer = window.setInterval(function() {
        var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
        $('#elapsed-second').text(elapsedSeconds);

        if (elapsedSeconds >= 10) {
            window.clearInterval(timer);
        }
     }, 1000);
});// jQuery ready function
