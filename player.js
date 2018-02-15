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
	
	restoreFromJson(obj) {
		for(var key in obj) {
			this[key] = obj[key];
		}
	}
	
	// count the number of sunken ship according to the shipList
	countSunkShips() {
		var sunkShipCount = 0;
		for(var index in this.oppShipList) {
			if(this.isBoatAtIndexSunk(index))
				sunkShipCount ++;					
		}
		return sunkShipCount;
	}
	
	// place ship into this player's own grid
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

	// GET the index of a ship from the shipList
	// with a x,y coordinate
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
	
	// GET the coordinate set from the shipList using index 
	getBoatLocationWithIndex(index) {
		var ship = this.oppShipList[index];
		return ship;
	}

	// CHECK using index to get a ship's location coordinate
	// and see if that boat has sank
	isBoatAtIndexSunk(index) {
		var ship = this.oppShipList[index];
		for(var individualCor in ship) {
			var cor = ship[individualCor];
			var x = cor.x;
			var y = cor.y;
			if(this.oppView[x][y] == "S") {
				return false;
			}
		}
		return true;
	}
	
	// check if all opp ships has sank
	oppShipsAllSunk() {
		for(var index in this.oppShipList) {
			if(!this.isBoatAtIndexSunk(index))
				return false;					
		}
		return true;
	}

	// update this player's ships in the grid
	updateShipLoc(x, y) {
		this.shipLoc[x][y] = "S";
	}
	// update this player's shots 
	updateOppView(x, y, state) {
		this.shotTook += 1;
		this.oppView[x][y] = state;
	}
	// store a copy of opponent's ships list
	updateOppShipList(list) {
		this.oppShipList = list;
	}
	// store a copy of the opponent's grid 
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
