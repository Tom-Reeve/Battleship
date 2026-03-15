class Player {
    constructor() {
        this.cells = [];

        this.shipCount = 0;
        this.shipCells = [];
        this.shipLengths = [5, 4, 3, 3, 2];

        this.settingShips = true;
        this.placedMarker = false;
    }
    setCells() {
        for (let i = 0 ; i < this.cells.length ; i++) {
            let cell = this.cells[i];

            cell.addEventListener("click", () => {
                if (!this.settingShips || cell.hasShip || this.shipCount === 5) {
                    return;
                }
                if (this.placedMarker) {
                    if (cell.marked) {
                        let value = cell.index;
                        let result = Object.values(this.markedCells).find(arr => arr.includes(value)); //marked cells in dir chosen

                        for (const arr of Object.values(this.markedCells)) {
                            for (const num of arr) {
                                this.removeMarker(this.cells[num]);
                            }
                        }
                        this.removeMarker(this.firstMarked);

                        for (const num of result) {
                            this.placeShip(this.cells[num]);
                        }
                        this.placeShip(this.firstMarked);

                        this.shipCells.push(result);
                        this.placedMarker = false;
                        this.shipCount++;

                    }
                    return;
                }

                this.placeStartMarker(cell);
                this.placeShipOutline(cell);
            })
        }
    }
    placeShip(cell) {
        let ship = document.createElement("div");
        ship.setAttribute("class", "ship");

        cell.appendChild(ship);
    }
    removeMarker(cell) {
        cell.children[0].remove();
    }
    placeStartMarker(cell) {
        let marker = document.createElement("div");
        marker.setAttribute("class", "startMarker");

        cell.markedStart = true;
        this.placedMarker = true;
        this.firstMarked = cell

        cell.appendChild(marker);
    }
    placeMarker(cell) {
        let marker = document.createElement("div");
        marker.setAttribute("class", "marker");

        this.placedMarker = true;;
        cell.marked = true;

        cell.appendChild(marker);
    }
    placeShipOutline(cell) {
        let nextShip = this.shipLengths[this.shipCount];
        let flatShip = this.shipCells.flat();

        let shipNorth = true;
        let shipEast = true;
        let shipSouth = true;
        let shipWest = true; //validation for directions and intersecting existing ships

        this.markedCells = {};
        if (shipNorth) {
            let north = [];
            for (let i = 1 ; i < nextShip ; i++) {
                let nextCellIndex = cell.index - (10 * i);

                north.push(nextCellIndex);

                this.placeMarker(this.cells[nextCellIndex])
            }
            this.markedCells.N = north;
        }
        if (shipEast) {
            let east = [];
            for (let i = 1 ; i < nextShip ; i++) {
                let nextCellIndex = cell.index - i;
                east.push(nextCellIndex);

                this.placeMarker(this.cells[nextCellIndex])
            }
            this.markedCells.E = east;
        }
        if (shipSouth) {
            let south = [];
            for (let i = 1 ; i < nextShip ; i++) {
                let nextCellIndex = cell.index + (10 * i);
                south.push(nextCellIndex);

                this.placeMarker(this.cells[nextCellIndex])
            }
            this.markedCells.S = south;
        }
        if (shipWest) {
            let west = [];
            for (let i = 1 ; i < nextShip ; i++) {
                let nextCellIndex = cell.index + i;
                west.push(nextCellIndex);

                this.placeMarker(this.cells[nextCellIndex])
            }
            this.markedCells.W = west; 
        }
    }
}