class Player {
constructor(gridSize) {
	// stores col = row of the game board
	this.gridSize = gridSize;
	// store 2D for holding player's moves
	this.shipLoc = [];
	// 2D array storing opponent's moves
	this.oppView = [];
	// list holding ships location;
	this.shipList = [];
	// list holding ships location;
	this.oppShipList = [];
	// shots took
	this.shotTook = 0;
	// ships sunk
	this.sunkShips = 0;
	for (var i=0;i<gridSize;i++) {
		 this.oppView[i] = new Array(gridSize).fill("_");
		 this.shipLoc[i] = new Array(gridSize).fill("_");
	}
}

countSunkShips() {
	var sunkShipCount = 0;
	for(var index in this.oppShipList) {
		if(this.isBoatAtIndexSunk(index))
			sunkShipCount ++;					
	}
	return sunkShipCount;
}

placeShip(location){
	this.shipList.push(location);
	for(var index in location) {
		//console.log(location[index]);
		var cor = location[index];
		var x = cor.x;
		var y = cor.y;
		this.updateShipLoc(x, y);
	}
	//console.log(this.shipLoc);
}

getBoatIndexWithCor(x,y) {
	var list = this.oppShipList;
	for(var index in list) {
		var ship = list[index];
		//console.log("ship is: ");
		//console.log(ship);
		for(var i in ship) {
			var cor = ship[i];
			if(cor.x == x && cor.y == y)
				return index;
		}
	}
}

getBoatLocationWithIndex(index) {
	var ship = this.oppShipList[index];
	return ship;
}

isBoatAtIndexSunk(index) {
	//console.log("index: " + index);
	//console.log("oppShipList: ");
	//console.log(this.oppShipList);
	var ship = this.oppShipList[index];
	console.log(ship);
	for(var individualCor in ship) {
		var cor = ship[individualCor];
		var x = cor.x;
		var y = cor.y;
		if(this.oppView[x][y] == "S") {
			console.log("ship still alive");
			return false;
		}
	}
	console.log("ship at " + index + " sunk");
	return true;
}
oppShipsAllSunk() {
	for(var index in this.oppShipList) {
		if(!this.isBoatAtIndexSunk(index))
			return false;					
	}
	return true;
}
oppShipsAllSunkOld() {
	//console.log("oppShipList: ");
	//console.log(this.oppShipList);
	// read through list of ships coordinates
	// and checks each coordinate to see the state of cell
	for(var index in this.oppShipList) {
		var ship = this.oppShipList[index];
		//console.log("ship: " + index);
		//console.log(ship);
		for(var individualCor in ship) {
			var cor = ship[individualCor];
			var x = cor.x;
			var y = cor.y;
			//console.log(cor);
			//console.log(this.oppView[x][y]);
			if(this.oppView[x][y] == "S") {
				// as soon as a cell is "S" as in ship means game is not over
				return false;
			}
		}
		//console.log("ship: " + index + " sunk");
		// at this point, ship at index has sunk, update color
		var tag = "[cor-x=" + x + "][cor-y="+y + "]";
		console.log($(tag));;
		
	}
	//console.log("All ships sunk!");
	// if reached this point, means all ships sunk
	return true;
}

updateShipLoc(x, y) {
	this.shipLoc[x][y] = "S";
}

updateOppView(x, y, state) {
	this.shotTook += 1;
	this.oppView[x][y] = state;
	//console.log(this.oppView);
}

updateOppShipList(list) {
	this.oppShipList = list;
}

storeOppLoc(oppGrid) {
	this.oppView = oppGrid;
}
getShotAttempted() {
	return this.shotTook;
}
getStateAtCor(x,y) {
	return this.oppView[x][y];
}
getOppViewGrid() {
	return this.oppView;
}
getSelfGrid() {
	return this.shipLoc;
}
getShipList() {
	return this.shipList;
}
printGrid() {
	console.log(this.shipLoc);
	console.log(this.oppView);
}
}

function showSunkShip(x,y, playerTag) {
if(playerTag == ".p1-opp-view")
	var player = p1;
else
	var player = p2;
// get the location of ship with the coordinate
var shipIndex = player.getBoatIndexWithCor(x,y);
console.log(shipIndex);
var shipSunk = player.isBoatAtIndexSunk(shipIndex);
if(shipSunk) {
	console.log("Sunk " + shipIndex + " ship!!!!");
	// get the location on the ship that sunk
	var shipLocation = player.getBoatLocationWithIndex(shipIndex);
	console.log("a");
	console.log(shipLocation);
	// update each coordinates class tag to display accordingly
	for(var index in shipLocation) {
	console.log("b");
		var cor = shipLocation[index];
	console.log("c: ");
	console.log(cor);
		var xcor = cor.x;
	console.log("e: " + xcor);
		var ycor = cor.y;
	console.log("f: " + ycor);
		
		var tag = "[cor-x=" + xcor + "][cor-y=" + ycor + "]";
	console.log("g: " + tag);
		$(playerTag).find(tag).removeClass("hit");
	console.log("h");
		$(playerTag).find(tag).addClass("sink");
	}
}
}

function generateScoreTally() {
var scoreTally = "Player 1 Sunk: " + p1.countSunkShips() + " ships\r";
scoreTally += "Player 2 Sunk: " + p2.countSunkShips() + " ships\r\n";
scoreTally += "Player 1 took " + p1.getShotAttempted() + " shots\r";
scoreTally += "Player 2 took " + p2.getShotAttempted() + " shots\r\n";
scoreTally += "Total shots: " + (p1.getShotAttempted() + p2.getShotAttempted()) + "\r\n";
return scoreTally;
}

function shotShip(cell, playerSide) {
//console.log(playerSide);
// only can shot if fired class tag is not there
if(!$(".menupane").hasClass("fired")) {
	// get info of the cell that triggered the callback
	var x = cell.getAttribute("cor-x");
	var y = cell.getAttribute("cor-y");
	var classList = cell.getAttribute("class");
	//console.log("x: " + x + " y: " + y + " classList: " + classList);
	//console.log(cell);
	
	//var tag = "." + classList + "";
	//tag = tag.replace(/ /g, ".");
	// create tag for searching customized tag
	var tag = "[cor-x=" + x + "][cor-y="+y + "]";
	//tag = tag.replace(/ /g, ".");
	
	// update cell according who's cell fired the callback
	if(classList.includes("p1-opp-view")) {
		// if the cell is miss or a hit end callback and 
		// does not mark fired for the round
		if(p1.getStateAtCor(x,y) == "H" || p1.getStateAtCor(x,y) == "X")
			return;
		// reads the list of classes of the cell
		// if the cell has ship then it means a hit
		if(classList.includes("ship")) {
			// update opponent's view grid as hit
			p1.updateOppView(x,y, "H");
			$(".p1-opp-view").find(tag).addClass("hit");
			// check if ship with coordinate is sunk
			// if so get the boats coordinates and expose boat by changing class tag from hit to sink
			showSunkShip(x,y, ".p1-opp-view");
			// check if all ship has sunk and end game if so
			if(p1.oppShipsAllSunk()) {
				//alert("Player 1 win! \r\nTook " + p1.getShotAttempted() + " shots.");
				var popUp = function () {
					var scoreTally = generateScoreTally();
					if (confirm("Player 1 Won!\r\n" + scoreTally + "Restarting game by clicking Ok\r\n")) {
						resetGame();
					}
				};
				popUp();
			}
		}
		// else it's missed shot
		else {
			p1.updateOppView(x,y, "X");
			$(".p1-opp-view").find(tag).removeClass("hide");
		}
	}
	else if(classList.includes("p2-opp-view")) {
		if(p2.getStateAtCor(x,y) == "H" || p2.getStateAtCor(x,y) == "X")
			return;
		if(classList.includes("ship")) {
			p2.updateOppView(x,y, "H");
			$(".p2-opp-view").find(tag).addClass("hit");
			showSunkShip(x,y, ".p2-opp-view");
			if(p2.oppShipsAllSunk()) {
				//alert("Player 1 win! \r\nTook " + p1.getShotAttempted() + " shots.");
				var scoreTally = generateScoreTally();
				var popUp = function () {
					if (confirm("Player 2 Won!\r\n" + scoreTally + "Restarting game by clicking Ok\r\n")) {
						resetGame();
					}
				};
				popUp();
			}
		}
		else {
			p2.updateOppView(x,y, "X");
			$(".p2-opp-view").find(tag).removeClass("hide");
		}
	}
	// fired class tag to indicate a shot has been fired in this round
	// and a switch side is needed to reset the fired state
	$(".menupane").addClass("fired");
}
}

function generateShip(size, shipType) {
// get point of origin
var x = Math.floor(Math.random() * size);
var y = Math.floor(Math.random() * size);

var max;
if(shipType == "sqr") {
	max = 1;
}
else if(shipType == "l") {
	max = 2;
}
else if(shipType == "line") {
	max = 3;
}

while(x + max >= size) {
	x = Math.floor(Math.random() * size);
}
while(y + max >= size) {
	y = Math.floor(Math.random() * size);
}

var location;
if(shipType == "l") {
	location = [{x:x, y:y}, {x:x+1, y:y}, {x:x+2, y:y}, {x:x, y:y+1}];
}
else if(shipType == "line") {
	location = [{x:x, y:y}, {x:x+1, y:y}, {x:x+2, y:y}, {x:x+3, y:y}];
}
else if(shipType == "sqr") {
	location = [{x:x, y:y}, {x:x+1, y:y}, {x:x, y:y+1}, {x:x+1, y:y+1}];
}

//console.log("ship-" + shipType);
//console.log(location);
return location;
}

function createAllShips(player) {
// generate 4 ships: 1 x L, 1 x square, 2 x line
var ship;
var playerGrid = player.getSelfGrid();
// after ship generated, check if the location is taken
// is so, regenerate ship location
do 
{
	ship = generateShip(8, "l"); // L shape ship
} 
while (!canPutShip(ship, playerGrid));
player.placeShip(ship);

do 
{
	ship = generateShip(8, "line"); // line shape ship
} 
while (!canPutShip(ship, playerGrid));
player.placeShip(ship);

do 
{
	ship = generateShip(8, "line"); // line shape ship
} 
while (!canPutShip(ship, playerGrid));
player.placeShip(ship);

do 
{
	ship = generateShip(8, "sqr"); // square shape ship
} 
while (!canPutShip(ship, playerGrid));
player.placeShip(ship);
console.log(player.getShipList());
}

function canPutShip(locationArray, playerGrid) {
//console.log(player.getSelfGrid());
for(var index in locationArray) {
	var cor = locationArray[index];
	var x = cor.x;
	var y = cor.y;
	if(playerGrid[x][y] == "S") {
		console.log("cor x: " + x + " cor y: " + y + " taken");
		return false;
	}
}
return true;
}

var p1; 
var p2;
function startGame() {
// start the game is the game-start class tag isn't found
// that way you can not spam starting a game 
if(!$(".menupane").hasClass("game-start")) {;
	var rowSize = 8;
	// initialize player with grid size
	p1 = new Player(rowSize);
	p2 = new Player(rowSize);
	
	// create and place 4 ships into each player's grid
	createAllShips(p1);
	createAllShips(p2);
	
	// exchange ship placement so each player can check against
	// themselves to know whether they've won
	p2.storeOppLoc(p1.getSelfGrid());
	p1.storeOppLoc(p2.getSelfGrid());
	p2.updateOppShipList(p1.getShipList());
	p1.updateOppShipList(p2.getShipList());
	$(".player1side").css("display", "inline");
	drawGrid();
}
}

function switchSide() {
// only allow switch side function if the game has started
if($(".menupane").hasClass("game-start") && !$(".menupane").hasClass("gameover")) {
	if($(".player1side").css("display") != 'none' && $(".player2side").css("display") == 'none') {
		$(".player1side").css("display", "none");
		$(".player2side").css("display", "block");
	}
	else {
		$(".player2side").css("display", "none");
		$(".player1side").css("display", "block");
	}
	// once side switched, reset the fired class tag
	$(".menupane").removeClass("fired")
}
}

function resetGame() {
$(".p1grid").remove();
$(".p2grid").remove();
// the game-start is a tag to signify the start of a game
// to restart the game you need to remove the game-start class tag
$(".menupane").removeClass("game-start");
location.reload();
}

function drawGrid(row) {
// if the game has not begin, identify by the game-start class name
// then generate tables according to players' stat and draw them
if(!$(".menupane").hasClass("game-start")) {
	$(".menupane").addClass("game-start");
	$(".p1grid").append(generateTable(p1.getOppViewGrid(), "p1-opp-view"));
	$(".p2grid").append(generateTable(p2.getOppViewGrid(), "p2-opp-view"));

	$(".p1grid").append(generateTable(p1.getSelfGrid(), "p1view"));
	$(".p2grid").append(generateTable(p2.getSelfGrid(), "p2view"));
}
}

// Generates the table element as GUI
function generateTable(array, tableTag) {
var table ='<table class="' + tableTag + '" width="300" height="300" border="1">';
for(var row = 0; row < array.length; row++) {
	table += "<tr>";
	for(var col = 0; col < array[row].length; col++) {
		var classString = tableTag;
		// if coordinate is a ship then add class ship for coloring
		if(array[row][col] == "S") {
			classString += " ship";
		}
		// if table was opp-view then attach call back when a cell is clicked
		if(tableTag == "p1-opp-view" || tableTag == "p2-opp-view") {
			var callBack = 'shotShip(this,"' + tableTag + '")';
			table += "<td class='" + classString + " hide 'onclick='" + callBack + "' cor-x='" + row +"' cor-y='" + col + "'";
		}
		else {
			table += "<td class='" + classString + "' cor-x='" + row +"' cor-y='" + col + "'";
		}
		table += "></td>";
	}
	table += "</tr>"
}
table += "</table>";
return table;
}
