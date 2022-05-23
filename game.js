var START_RADIUS = 500;
var INCREMENT = 1;
var CHANGE_COLORS_AT = 10;
var circle;
var NUM_COLS = 7;
var NUM_ROWS = 6;
var PIECE_DIM; 
var RED = 1;
var YELLOW = 2;
var EMPTY = 0;
var curTurn = YELLOW;
var gameOver = false;
var board;
var homescreen = true;


function start(){
    setBackground();
    startButton();
    mouseClickMethod(startGame)
}
function startGame() {
    if(homescreen) {
        homescreen = false;
        circle == new Circle(START_RADIUS);
        board = new Grid(NUM_ROWS, NUM_COLS);
        initBoard();
        setPieceDimension();
        drawBoard();
        var mySong = new Audio("https://www.youtube.com/watch?v=VBlFHuCzPgY");
        mySong.loop = true;
        mySong.play();
        mouseClickMethod(addPiece);
    }
}

function dividMath(){
   var divisor = Randomizer.nextInt(2,10);
    var answer = Randomizer.nextInt(2,10);
    var dividend = divisor * answer;

    var response = parseInt(prompt("What is " + dividend  + "/" +  divisor));
    while(response != answer) {
        response = parseInt(prompt("Try again: what is " + dividend  + "/" +  divisor));
    }
}
function multiMath(){
    var multiplicand = Randomizer.nextInt(2,5);
    var multiplier = Randomizer.nextInt(2,5);
    var answer = multiplicand * multiplier;

    var response = parseInt(prompt("What is " + multiplier  + "*" +  multiplicand));
    while(response != answer) {
        response = parseInt(prompt("Try again: what is " + multiplier  + "*" +  multiplicand));
        multiMath();
    }
}    

function goMath(){
    dividMath();
    multiMath();
}
//adds a piece in the lowest empty row
//of the column clicked. Increments the turn color
function addPiece(e){
    if(!gameOver){
        var cir = new Circle(PIECE_DIM/2);
        var color = getTurnColor();
        cir.setColor(color);
        var x_pos=e.getX();
        var col = getColumnClicked(x_pos);
        if (col < 0) {
            col = 0;
        }
        var row = getCurRow(col);
        if (row < 0) {
            row = 0;
        }
        if (board.get(row, col) != EMPTY) {
            return;
        }
        addCircleAtRowColumn(row,col, cir);
        board.set(row,col,curTurn);
        if(checkForWin(row, col)){
             removeAll();
            displayWinner();
            gameOver=true;
        }else{
            incrementTurn();
            multiMath();
        }
    }
}
    // make start button
    function startButton(){
       startButton = new Rectangle(150, 50);
    startButton.setPosition((getWidth() / 2) - (startButton.getWidth() / 2), 255);
    startButton.setColor("#4859A8");
    var startButtonBorder = new Rectangle(160, 60);
    startButtonBorder.setPosition((getWidth() / 2) - (startButtonBorder.getWidth() / 2), 250);
    startButtonBorder.setColor(Color.black);
    add(startButtonBorder);
     add(startButton);
     var txt = new Text("Start", "30pt Arial");
    txt.setPosition(155, 290);
    txt.setColor(Color.black);
    add(txt);
    }
    function setBackground(){
    // makes a game background variable and adds it to the screen
    // this has got to be done before anything else is added
    setBackground = new
    WebImage("https://live.staticflickr.com/8684/16323734913_4bde0414df_b.jpg");
    setBackground.setSize(getWidth(), getHeight());
    setBackground.setPosition(0, 0);
    add(setBackground);
}
// Displays a message declaring the current player as
//winner 
var circle;
function displayWinner(){
    var x = getWidth() / 1;
    var y = getHeight() / 1;
    circle = new Circle(1000);
    circle.setPosition(x, y);
    add(circle);
    setTimer(grow, 1);
}
function grow(){
    var size = circle.getRadius();
    size = size + INCREMENT;
    circle.setRadius(size);
    if(size% 10== 1){
    var color = Randomizer.nextColor();
    circle.setColor(color);
    
     var winner;
    if(curTurn == RED){
        winner = "Red";
    }else{
        winner = "Yellow";
    }
    var txt = new Text(winner + " wins!", "30pt Arial");
    console.log(winner + "wins!")  
    txt.setPosition(100, 200);
    txt.setColor(Color.black);
    add(txt);
}
    if(size == getHeight()/2){
    stopTimer(grow);
}
}
    
//Sets all the values in the grid to zero
function initBoard(){
    for (var row = 0; row < NUM_ROWS; row++){
        for (var col = 0; col < NUM_COLS; col++){
            board.set(row, col, EMPTY);
        }
    }
}

//Calculates the lowest empty row in a given column
function getCurRow(col){
    for (var row = board.numRows() - 1; row >= 0; row--){
        if (board.get(row, col) == EMPTY){
            return row;
        }
    }
    return -1;
}

function checkForWin(row,col){
    if(checkRowForWin(row))
        return true;
    if(checkColForWin(col))
        return true;
    if(checkPosDiagForWin(row,col))
        return true;
    if(checkNegDiagForWin(row,col))
        return true;
    return false;
}

//Scans the given row for a win(four in a row)
function checkRowForWin(row){
    var numInARow = 0;
    var currentColor = EMPTY;
    for (var col = 0; col < NUM_COLS; col++){
        var val = board.get(row, col);
        if (val == currentColor){
            numInARow++;
            if(numInARow == 4 && currentColor != EMPTY){
                println("row");
                return true;
            }
        } else {
            numInARow = 1;
            currentColor = val;
        }
    }
    return false;
}

//Scans the given column for a win(four in a row)
function checkColForWin(col){
    var numInARow = 0;
    var currentColor = EMPTY;
    for (var row = 0; row < NUM_ROWS; row++){
        var val = board.get(row, col);
        if (val == currentColor){
            numInARow++;
            if (numInARow == 4 && currentColor != EMPTY){
                println("col");
                return true;
            }
        } else {
            numInARow = 1;
            currentColor = val;
        }
    }      
    return false;
}

//Scans positive diagonal for a win(four in a row)
function checkPosDiagForWin(row, col){
    var cur_row = row;
    var cur_col = col;
    var currentColor = board.get(row, col);
    var last = currentColor;
    var up = 0;
    var down = 0;
    while (cur_row < NUM_ROWS && cur_col < NUM_COLS && last == currentColor){
        last = board.get(cur_row, cur_col);
        if(last == currentColor){
            up++;
        }
        cur_row++;
        cur_col++;
    }
    cur_row = row;
    cur_col = col;
    last = board.get(cur_row, cur_col)
    while (cur_row > 0 && cur_col > 0 && last == currentColor){
        last = board.get(cur_row, cur_col);
        if(last == currentColor){
            down++;
        }
        cur_row--;
        cur_col--;
    }
    if (up + down > 4){
        console.log(up, down, "posDiag");
        return true;
    }
    return false;
}

//Scans negative diagonal for a win(four in a row)
function checkNegDiagForWin(row, col){
    var cur_row = row;
    var cur_col = col;
    var currentColor = board.get(row,col);
    var last = currentColor;
    var up = 0;
    var down = 0;
    while(cur_row < NUM_ROWS && cur_col > 0 && last == currentColor){
        last = board.get(cur_row, cur_col);
        if(last == currentColor){
            up++;
        }
        cur_row++;
        cur_col--;
    }
    cur_row = row;
    cur_col = col;
    last = board.get(cur_row, cur_col)
    while (cur_row > 0 && cur_col < NUM_COLS && last == currentColor){
        last = board.get(cur_row, cur_col);
        if (last==currentColor){
            down++;
        }
        cur_row--;
        cur_col++;
    }
    if (up + down > 4){
        println("negDiag");
        return true;
    }
    return false;
}


//returns the color associated with this turn
function getTurnColor(){
    if (curTurn == YELLOW){
        return Color.YELLOW
    }    
    return Color.RED;
}

//toggles curTurn
function incrementTurn(){
    if (curTurn == YELLOW){
        curTurn = RED;
    } else {
        curTurn = YELLOW;
    }
}

//returns the column where the click occured
function getColumnClicked(x){
    var column = (x - x % PIECE_DIM) / PIECE_DIM;
    return column
}

//draws the background and adds
//white "holes" in a grid
function drawBoard(){
    drawBoardBackground();
    for (var row = 0; row < NUM_ROWS; row++){
        for (var col=0; col < NUM_COLS; col++){
            var cir = new Circle(PIECE_DIM / 2);
            cir.setColor(Color.GREY);
            addCircleAtRowColumn(row, col, cir);
        }
    }
}

//sets the piece dimension based 
//on the largest possible given canvas
//and board dimensions
function setPieceDimension(){
    var height = getHeight();
    var width = getWidth();
    if (width / NUM_COLS < height / NUM_ROWS){
        PIECE_DIM = width / NUM_COLS;
    }else{
        PIECE_DIM = height / NUM_ROWS;
    }
}

function addCircleAtRowColumn(row, col, cir){
    var half = PIECE_DIM / 2;
    var x = col * PIECE_DIM + half;
    var y = row * PIECE_DIM + half;
    cir.setPosition(x, y);
    add(cir);
}

//Draws a blue square at 0,0 that is as 
//big as the limiting canvas dimension allows
function drawBoardBackground(){
    var board_width = NUM_COLS * PIECE_DIM;
    var board_height = NUM_ROWS * PIECE_DIM;
    var rect = new Rectangle(board_width, board_height);
    rect.setPosition(0, 0);
    rect.setColor(Color.BLUE);
    add(rect);
}