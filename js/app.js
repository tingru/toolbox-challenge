
$(document).ready(function () {
    var tiles = [];
    var tileBack = 'img/tile-back.png';
    var gameBoard = $('#game-board');
    var idx;
    var flippedImages = [];
    var matchedCount = 0;
    var missedCount = 0;
    var remainingPairs = 8;

    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg'
        });
    }
    onReset();

    var startTime = _.now();
    var timer = window.setInterval(onTimer, 1000);

    $('#reset-button').click(onReset); // on click of the Start button

    function createPairs() {
        var shuffledTiles = _.shuffle(tiles);
        var selectedTiles = shuffledTiles.slice(0, 8);

        var tilePairs = [];
        _.forEach(selectedTiles, function (tile) {
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);

        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function (tile, elemIndex) {
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
            img.data('matched', false);
            row.append(img);
        });
        gameBoard.append(row);

        $('#game-board img').click(onClick);
    }

    function onClick() {
        var img = $(this);
        var currentTile = img.data('tile');
        var isMatched = img.data('matched');
        if (isMatched) {
            // flag error:
            alert("You already found a matched for this one. Try clicking on other hidden tiles");
            return;
        }
        img.data('matched', true);
        flipTile(img);

        if (flippedImages.length == 0) {
            flippedImages.push(img);
        } else if (flippedImages[0] === img) {
            // flag error:
            alert("Don't click on the same tile.");
            return;
        } else {
            // validating two tiles
            var otherImg = flippedImages[0];
            var otherTile = otherImg.data('tile');
            console.log("otherTile: " + otherTile.tileNum);
            console.log("currentTile: " + currentTile.tileNum);
            if (otherTile.tileNum == currentTile.tileNum) {
                // found a match
                // increase the match counter
                matchedCount++;
                remainingPairs--;
                $('#matches-times').text(matchedCount);
                $('#remaining-pairs').text(remainingPairs);
                
            } else {
                // not a match
                // increase the missing counter
                missedCount++;
                $('#mistakes-times').text(missedCount);

                img.data('matched', false);
                otherImg.data('matched', false);
                // flip them back after 1 second
                window.setTimeout(function () {
                    flipTile(img);
                    flipTile(otherImg);
                }, 1000);
            }
            flippedImages.length = 0;
        }
    }

    function flipTile(img) {
        var currentTile = img.data('tile');
        img.fadeOut(100, function () {
            if (currentTile.flipped) {
                img.attr('src', tileBack);
            }
            else {
                img.attr('src', currentTile.src);
            }
            currentTile.flipped = !currentTile.flipped;
            img.fadeIn(100);
        });
    }

    function onTimer() {
        var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
        if (remainingPairs == 0) {
            window.clearInterval(timer);
        }
        $('#elapsed-seconds').text(elapsedSeconds);
    }

    function onReset() {
        console.log("onReset called.");
        matchedCount = 0;
        missedCount = 0;
        remainingPairs = 8;
        startTime = _.now();
        //$('#elapsed-seconds').text("0");
        $('#matches-times').text(matchedCount);
        $('#mistakes-times').text(missedCount);
        $('#remaining-pairs').text(remainingPairs);
        gameBoard.empty();
        createPairs();
        $('img').hide().fadeIn(1000);
    }
});// jQuery ready function
