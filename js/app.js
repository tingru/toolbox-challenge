
$(document).ready(function () {
    var tiles = [];
    var tileBack = 'img/tile-back.png';
    var gameBoard = $('#game-board');
    var messageBox = $('#message-box');
    var idx;
    var flippedImages = [];
    var missedCount = 0;
    var remainingPairs = 8;

    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg'
        });
    }
    
    var startTime;
    var timer;
    // on click of the Start button
    $('#reset-button').click(onReset);

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
        if (remainingPairs == 0) {
            messageBox.text("This game is over. Click the button at top to start new game.");
            return;
        }
        var img = $(this);
        var currentTile = img.data('tile');
        if (img.data('matched')) {
            messageBox.text("You already got this. Try clicking on other hidden tiles.");
            messageBox.attr('class', 'row invalid');
            return;
        } else {
            messageBox.text("");
        }
        img.data('matched', true);
        flipTile(img);

        if (flippedImages.length == 0) {
            flippedImages.push(img);
        } else {
            // validating two tiles
            var otherImg = flippedImages[0];
            var otherTile = otherImg.data('tile');
            //console.log("otherTile: " + otherTile.tileNum);
            //console.log("currentTile: " + currentTile.tileNum);
            if (otherTile.tileNum == currentTile.tileNum) {
                // found a match
                // decrese the remaining counter
                remainingPairs--;
                $('#matches-times').text(8 - remainingPairs);
                $('#matches-times').slideDown(500);
                $('#remaining-pairs').text(remainingPairs);
                $('#remaining-pairs').slideDown(500);
                
                // completed the game
                if (remainingPairs == 0) {
                    window.clearInterval(timer);
                    messageBox.text("Awesome! You found all pairs! Try again?");
                    messageBox.attr('class', 'row completed');
                    messageBox.animate({
                        fontSize: '3em'
                    }, "slow");
                } else {
                    messageBox.text("Good job!");
                    messageBox.attr('class', 'row valid');
                }
            } else {
                // not a match
                // increase the missing counter
                missedCount++;
                $('#mistakes-times').text(missedCount);
                $('#mistakes-times').slideDown(500);

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
        $('#elapsed-seconds').text(elapsedSeconds);
    }

    function onReset() {
        console.log("resetting the game.");
        missedCount = 0;
        remainingPairs = 8;
        
        $('#matches-times').text(0);
        $('#mistakes-times').text(missedCount);
        $('#remaining-pairs').text(remainingPairs);
        $('#elapsed-seconds').text("0");
        gameBoard.empty();
        createPairs();
        $('img').hide().fadeIn(1000);

        messageBox.text("");
        messageBox.attr('class', 'row invalid');
        messageBox.css({
            fontSize: '1em'
        });

        startTime = _.now();
        window.clearInterval(timer);
        timer = window.setInterval(onTimer, 1000);
    }
});// jQuery ready function
