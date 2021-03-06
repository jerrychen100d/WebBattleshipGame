function showSunkShip(x,y, playerTag) {
	if(playerTag == ".p1-opp-view")
		var player = p1;
	else
		var player = p2;
	// get the location of ship with the coordinate
	var shipIndex = player.getBoatIndexWithCor(x,y);
	var shipSunk = player.isBoatAtIndexSunk(shipIndex);
	if(shipSunk) {
		// get the location on the ship that sunk
		var shipLocation = player.getBoatLocationWithIndex(shipIndex);
		// update each coordinates class tag to display accordingly
		for(var index in shipLocation) {
			var cor = shipLocation[index];
			var xcor = cor.x;
			var ycor = cor.y;
			player.updateOppView(xcor,ycor,"B");
			var tag = "[cor-x=" + xcor + "][cor-y=" + ycor + "]";
			$(playerTag).find(tag).removeClass("hit");
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

function shootShip(cell, playerSide) {
	// only can shot if fired class tag is not there
	if(!$(".menupane").hasClass("fired") && !$(".menupane").hasClass("gameover")) {
		// get info of the cell that triggered the callback
		var x = cell.getAttribute("cor-x");
		var y = cell.getAttribute("cor-y");
		var classList = cell.getAttribute("class");
		// create tag for searching customized tag
		var tag = "[cor-x=" + x + "][cor-y="+y + "]";
		var pTag = "." + playerSide;
		var shotTag = "result";
		var player;
		if(playerSide == "p1-opp-view") {
			player = p1
			shotTag += ".p1shot";
		}
		else {
			player = p2;
			shotTag += ".p2shot";
		}

		// if the cell is miss or a hit end callback and 
		// does not mark fired for the round
		if(player.getStateAtCor(x,y) == "H" || player.getStateAtCor(x,y) == "X")
			return;
		// reads the list of classes of the cell
		// if the cell has ship then it means a hit
		if(classList.includes("ship")) {
			// update opponent's view grid as hit
			player.updateOppView(x,y, "H");
			player.updateShootCount();
			$(pTag).find(tag).addClass("hit");
			$(shotTag).text("HIT!");
			// check if ship with coordinate is sunk
			// if so get the boats coordinates and expose boat by changing class tag from hit to sink
			showSunkShip(x,y, "." + playerSide);
			// check if all ship has sunk and end game if so
			if(player.oppShipsAllSunk()) {
				//alert("Player 1 win! \r\nTook " + p1.getShotAttempted() + " shots.");
				// gameover class tag added to prevent undesired behaviors
				$(".menupane").addClass("gameover");
				// display both player's grid
				showAll();
				// delete everything from sessionStorage when game is over
				sessionStorage.clear();
				var popUp = function () {
					var scoreTally = generateScoreTally();
					var playerText;
					if(playerSide == "p1-opp-view")
						playerText = "1";
					else
						playerText = "2";
					if (confirm("Player " + playerText + " Won!\r\n" + scoreTally + "Restarting game by clicking Ok\r\n")) {
						resetGame();
					}
				};
				popUp();
			}
		}
		// else it's missed shot
		else {
			player.updateOppView(x,y, "X");
			player.updateShootCount();
			$(pTag).find(tag).removeClass("hide");
			$(shotTag).text("MISSED!");
		}
		
		// fired class tag to indicate a shot has been fired in this round
		// and a switch side is needed to reset the fired state
		$(".menupane").addClass("fired");
		// save game state to sessionStorage
		saveIntoSessionWithKey("player1", p1);
		saveIntoSessionWithKey("player2", p2);
		saveIntoSessionWithKey("turn-end-by", playerSide);
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
}

function canPutShip(locationArray, playerGrid) {
	//console.log(player.getSelfGrid());
	for(var index in locationArray) {
		var cor = locationArray[index];
		var x = cor.x;
		var y = cor.y;
		if(playerGrid[x][y] == "S") {
			return false;
		}
	}
	return true;
}

function readFromSessionWithKey(key) {
	if(key == "turn-end-by")
		return sessionStorage.getItem(key);
	return JSON.parse(sessionStorage.getItem(key));
}

function saveIntoSessionWithKey(key, value) {
	if(typeof(value) === "object")
		sessionStorage.setItem(key, JSON.stringify(value));
	else
		sessionStorage.setItem(key, value);
}

function clearSessionCacheKey(key) {
	sessionStorage.removeItem(key);
}

var p1; 
var p2;
var rowSize = 8;
// initialize player with grid size
p1 = new Player(rowSize);
p2 = new Player(rowSize);

function startGame() {
	// start the game is the game-start class tag isn't found
	// that way you can not spam starting a game 
	if(!$(".menupane").hasClass("game-start")) {
		
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
		//console.log(p1);
		drawGrid();
	}
}

function showAll() {
	$(".player2side").css("display", "block");
	$(".player1side").css("display", "block");
	$("result").text("");
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
		$("result").text("");
	}
}

function resetGame() {
	$(".p1grid").remove();
	$(".p2grid").remove();
	// the game-start is a tag to signify the start of a game
	// to restart the game you need to remove the game-start class tag
	$(".menupane").removeClass("game-start");
	sessionStorage.clear();
	location.reload();
}

function drawGrid() {
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
			if(array[row][col] == "S" || array[row][col] == "B" || array[row][col] == "X" || array[row][col] == "H") {
				classString += " ship";
			}
			
			// if table was opp-view then attach call back when a cell is clicked
			if(tableTag == "p1-opp-view" || tableTag == "p2-opp-view") {
				if(array[row][col] == "H") {
					classString += " ship hit";
				}
				else if(array[row][col] == "B") {
					classString += " sink";
				}
				else if(array[row][col] == "X") {
					classString += " miss";
				}
				var callBack = 'shootShip(this,"' + tableTag + '")';
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

// once page is ready, restore game stat by reading from session storeOppLoc
// load player 1 and player and display side accordingly
$(function() {
    // read player 1 and 2's instance from sessionStorage
		p1stat = readFromSessionWithKey("player1");
    p2stat = readFromSessionWithKey("player2");
		
		// read who end the last turn-end-by
		var lastPlayer = readFromSessionWithKey("turn-end-by");
	
		// only restore the game is both players stat are located
		if(p1stat != null && p2stat != null) {
			p1.restoreFromJson(p1stat);
			p2.restoreFromJson(p2stat);
			
			if(lastPlayer == "p1-opp-view") {
				$(".player1side").css("display", "none");
				$(".player2side").css("display", "block");
			}
			else {
				$(".player2side").css("display", "none");
				$(".player1side").css("display", "block");
			}
			drawGrid();
			// add class tag to show game already start so Start button will not be actionable
			$(".menupane").addClass("game-start");
		}
});