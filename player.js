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
	oppShipsAllSunk() {
		for(var index in this.oppShipList) {
			if(!this.isBoatAtIndexSunk(index))
				return false;					
		}
		return true;
	}
	oppShipsAllSunkOld() {
		// read through list of ships coordinates
		// and checks each coordinate to see the state of cell
		for(var index in this.oppShipList) {
			var ship = this.oppShipList[index];
			for(var individualCor in ship) {
				var cor = ship[individualCor];
				var x = cor.x;
				var y = cor.y;
				if(this.oppView[x][y] == "S") {
					// as soon as a cell is "S" as in ship means game is not over
					return false;
				}
			}
			// at this point, ship at index has sunk, update color
			var tag = "[cor-x=" + x + "][cor-y="+y + "]";			
		}
		// if reached this point, means all ships sunk
		return true;
	}

	updateShipLoc(x, y) {
		this.shipLoc[x][y] = "S";
	}

	updateOppView(x, y, state) {
		this.shotTook += 1;
		this.oppView[x][y] = state;
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
