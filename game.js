let computer_coords_numbers = document.getElementsByClassName("number-coords-container-mini")[0];
let computer_coords_letters = document.getElementsByClassName("letter-coords-container-mini")[0];
let computer_grid = document.getElementById("computer-grid");
let computer_last_shot_info = document.getElementById("computer-hit-info");
let computer_remaining_ships_container = document.getElementsByClassName("ship-info")[1];
let computer_remaining_ships;
let computer_cells = [];

let player_coords_numbers = document.getElementsByClassName("number-coords-container-mini")[1];
let player_coords_letters = document.getElementsByClassName("letter-coords-container-mini")[1];
let player_grid = document.getElementById("player-grid");
let player_last_shot_info = document.getElementById("player-hit-info");
let player_remaining_ships_container = document.getElementsByClassName("ship-info")[0];
let player_remaining_ships;
let player_cells = [];

let ship_names = Object.keys(Game.ships);
let computer_ship_coords;
let player_ship_coords;

let grid_letters = "ABCDEFGHIJ";

let player_turn = true;

let computer_next_shots = [];

let restart_button = document.getElementById("restart");

function SetShipInfo() {
    for (let i = 0 ; i < ship_names.length ; i++) {
        let player_ship_div = document.createElement("div");
        let computer_ship_div = document.createElement("div");

        player_ship_div.setAttribute("class", "ship-info-div player");
        computer_ship_div.setAttribute("class", "ship-info-div computer");

        player_remaining_ships_container.appendChild(player_ship_div);
        computer_remaining_ships_container.appendChild(computer_ship_div);
    }
    player_remaining_ships = document.getElementsByClassName("player");
    computer_remaining_ships = document.getElementsByClassName("computer");

    for (let i = 0 ; i < player_remaining_ships.length ; i++) {
        let ship_name = ship_names[i];
        let computer_ship_length = Object.values(Game.computer_ships)[i];
        let player_ship_length = Object.values(Game.ships)[i];

        computer_remaining_ships[i].innerHTML = ship_names[i] + " ( " + computer_ship_length + " ) ";
        player_remaining_ships[i].innerHTML = ship_names[i] + " ( " + player_ship_length + " ) ";
    }

    computer_ship_coords = Object.values(Game.computer_ship_coords);
    player_ship_coords = Object.values(Game.player_ship_coords);
    
    DrawGridCoords();
}

function UpdateShipInfo(last_shot_player) {
    let info_to_update;
    let ship_length;
    
    if (last_shot_player) {
        info_to_update = document.getElementsByClassName("computer");
        ship_length = Object.values(Game.computer_ships);
    } else {
        info_to_update = document.getElementsByClassName("player");
        ship_length = Object.values(Game.ships);
    }

    for (let i = 0 ; i < info_to_update.length ; i++) {
        info_to_update[i].innerHTML = ship_names[i] + " ( " + ship_length[i] + " ) ";
    }

    CheckGameOver();
}

function DrawGridCoords() {
    for (let i = 0 ; i < grid_letters.length ; i++) {
        let computer_number_div = document.createElement("div");
        let computer_letter_div = document.createElement("div");

        let player_number_div = document.createElement("div");
        let player_letter_div = document.createElement("div");

        computer_number_div.setAttribute("class", "coord number-coord");
        computer_letter_div.setAttribute("class", "coord letter-coord");

        player_number_div.setAttribute("class", "coord number-coord");
        player_letter_div.setAttribute("class", "coord letter-coord");

        computer_number_div.innerHTML = i + 1;
        computer_letter_div.innerHTML = grid_letters[i];

        player_number_div.innerHTML = i + 1;
        player_letter_div.innerHTML = grid_letters[i];

        computer_coords_numbers.appendChild(computer_number_div);
        computer_coords_letters.appendChild(computer_letter_div);

        player_coords_numbers.appendChild(player_number_div);
        player_coords_letters.appendChild(player_letter_div);
    }

    ComputerCells();
}

function BlueShadeRGB() {
    let green_shade = Math.floor(Math.random() * 256 + 100);
    return "rgb(0," + green_shade + ",255)";
}

function ComputerCells() {
    for (let i = 0 ; i < 100 ; i++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        
        cell.index = i;
        cell.targeted = false;
        cell.contains_ship = false;
        cell.ship_name = null;

        cell.style.backgroundColor = BlueShadeRGB();

        computer_grid.appendChild(cell);

        computer_cells.push(cell);

        cell.addEventListener("click", CheckPlayerHit);
    }

    PlayerCells();
}

function CheckPlayerHit() {
    if (this.targeted || Game.state === "over" || !player_turn) {
        return;
    }
    
    this.targeted = true;
    
    if (this.contains_ship) {
        DrawShot(this.index, true, computer_cells);

        player_last_shot_info.innerHTML = "Hit " + this.ship_name

        Game.computer_ships[this.ship_name] -= 1;
        if (Game.computer_ships[this.ship_name] === 0) {
            Game.computer_ship_count--;

            player_last_shot_info.innerHTML = "Sunk " + this.ship_name;

            HighlightSunkShip(this.ship_name, false);
        }

        UpdateShipInfo(true);
    } else {
        DrawShot(this.index, false, computer_cells);

        player_last_shot_info.innerHTML = "Miss";
    }

    player_turn = !player_turn;
    ComputerShot();
}

function PlayerCells() {
    for (let i = 0 ; i < 100 ; i++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        
        cell.index = i;
        cell.targeted = false;
        cell.contains_ship = false;
        cell.ship_name = null;

        cell.style.backgroundColor = BlueShadeRGB();

        player_grid.appendChild(cell);

        player_cells.push(cell); 
    }

    AddComputerShips();
}

function AddComputerShips() {
    for (let i = 0 ; i < computer_ship_coords.length ; i++) {
        for (let j = 0 ; j < computer_ship_coords[i].length ; j++) {
            let ship_index = computer_ship_coords[i][j];
            let ship_name = ship_names[i];

            computer_cells[ship_index].contains_ship = true;
            computer_cells[ship_index].ship_name = ship_name;
        }
    }

    AddPlayerShips();
}

function AddPlayerShips() {
    for (let i = 0 ; i < player_ship_coords.length ; i++) {
        for (let j = 0 ; j < player_ship_coords[i].length ; j++) {
            let ship_index = player_ship_coords[i][j];
            let ship_name = ship_names[i];

            player_cells[ship_index].contains_ship = true;
            player_cells[ship_index].ship_name = ship_name;

            DrawPoint(ship_index, false, player_cells);
        }
    }
}

function DrawShot(index, hit, grid) {
    let circle = document.createElement("div");
    circle.setAttribute("class", "circle");

    let background_colour = hit ? "red" : "white";
    circle.style.backgroundColor = background_colour;

    grid[index].appendChild(circle);
}

function CheckGameOver() {
    if (Game.player_ship_count === 0) {
        Game.state = "over";
        
        player_last_shot_info.innerHTML = "COMPUTER WINS";
        computer_last_shot_info.innerHTML = "COMPUTER WINS";

        RevealComputerShips();
    }
    else if (Game.computer_ship_count === 0) {
        Game.state = "over";

        player_last_shot_info.innerHTML = "PLAYER WINS";
        computer_last_shot_info.innerHTML = "PLAYER WINS";
    }
    if (Game.state === "over") {
        restart_button.disabled = false;
    }
}

function Restart() {
    location.reload();
}

function ComputerShot() {
    if (Game.difficulty === "easy") {
        ComputerRandomShot();
    } else if (Game.difficulty === "medium") {
        ComputerHuntShot();
    } else if (Game.difficulty === "cheats") {
        Math.random() < 0.25 ? ComputerCheatShot() : ComputerHuntShot();
    }
    player_turn = !player_turn;
}

function ComputerCheatShot() {
    for (let i = 0 ; i < player_cells.length ; i++) {
        if (player_cells[i].contains_ship && !player_cells[i].targeted) {
            CheckComputerHit(player_cells[i]);
            break;
        }
    }
}

function ComputerRandomShot() {
    let cells_not_targeted = [];
    for (let i = 0 ; i < player_cells.length ; i++) {
        if (!player_cells[i].targeted) {
            cells_not_targeted.push(player_cells[i]);
        }
    }
    let random_cell = cells_not_targeted[Math.floor(Math.random() * cells_not_targeted.length)];

    CheckComputerHit(random_cell);
}

function ComputerHuntShot() {
    if (computer_next_shots.length === 0) {
        ComputerRandomShot();
    }
    else {
        let next_cell = player_cells[computer_next_shots[0]];
        
        if (next_cell.targeted) {
            computer_next_shots.shift();
            return ComputerHuntShot();
        }
        CheckComputerHit(next_cell);
            
        computer_next_shots.shift();
    }
}

function CheckComputerHit(coord) {
    if (Game.state === "over") {
        return;
    }
    coord.targeted = true;
    
    if (coord.contains_ship) {
        
        player_cells[coord.index].style.backgroundColor = "red";

        computer_last_shot_info.innerHTML = "Hit " + coord.ship_name;

        Game.ships[coord.ship_name] -= 1;
        if (Game.ships[coord.ship_name] === 0) {
            Game.player_ship_count--;

            computer_last_shot_info.innerHTML = "Sunk " + coord.ship_name;

            HighlightSunkShip(coord.ship_name, true);
        }
        UpdateHuntCoords(coord);

        UpdateShipInfo(false);
    } else {
        DrawShot(coord.index, false, player_cells);

        computer_last_shot_info.innerHTML = "Miss";
    }
    computer_last_shot_index = coord.index;
}

function UpdateHuntCoords(cell) {
    if (Game.difficulty !== "medium" && Game.difficulty !== "cheats") {
        return;
    }
    
    let cell_index_xy = IndexToXY(cell.index);
    let cell_x = cell_index_xy[0];
    let cell_y = cell_index_xy[1];

    let cell_index_1 = cell_x > 0 ? cell_x - 1 : cell_x;
    let cell_index_2 = cell_x < 9 ? cell_x + 1 : cell_x;
    let cell_index_3 = cell_y > 0 ? cell_y - 1 : cell_y;
    let cell_index_4 = cell_y < 9 ? cell_y + 1 : cell_y;

    let p1 = XYToIndex(cell_index_1, cell_y);
    let p2 = XYToIndex(cell_index_2, cell_y);
    let p3 = XYToIndex(cell_x, cell_index_3);
    let p4 = XYToIndex(cell_x, cell_index_4);

    if (!player_cells[p1].targeted && p1 !== cell.index) {
        computer_next_shots.push(p1);
    }
    if (!player_cells[p2].targeted && p2 !== cell.index) {
        computer_next_shots.push(p2);
    }
    if (!player_cells[p3].targeted && p3 !== cell.index) {
        computer_next_shots.push(p3);
    }
    if (!player_cells[p4].targeted && p4 !== cell.index) {
        computer_next_shots.push(p4);
    }
}

function RevealComputerShips() {
    let computer_coords_flat = computer_ship_coords.flat();
    for (let i = 0 ; i < computer_coords_flat.length ; i++) {
        computer_cells[computer_coords_flat[i]].style.backgroundColor = "purple";
    }
}

function HighlightSunkShip(ship_name, player_ship) {
    let ship_coords = player_ship ? Game.player_ship_coords : Game.computer_ship_coords;
    let grid = player_ship ? player_cells : computer_cells;

    let relevant_ship_coords = ship_coords[ship_name];
    for (let i = 0 ; i < relevant_ship_coords.length ; i++) {
        grid[relevant_ship_coords[i]].style.backgroundColor = "black";
    }
}









