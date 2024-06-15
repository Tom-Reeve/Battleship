let page_list = document.getElementsByClassName("page");
let play_button = document.getElementsByClassName("continue-button")[1];

let Game = {
    player_ship_count: 0,
    player_ship_coords: {},
    
    computer_ship_count: 0,
    computer_ship_coords: {},

    ships: {
        "Carrier": 5,
        "Battleship": 4,
        "Cruiser": 3,
        "Submarine": 3,
        "Destroyer": 2,
    },
    computer_ships: {
        "Carrier": 5,
        "Battleship": 4,
        "Cruiser": 3,
        "Submarine": 3,
        "Destroyer": 2,
    },

    state: "setup",
    custom_ships: false,
};

function Init() {
    Game = {
        player_ship_count: 0,
        player_ship_coords: {},

        computer_ship_count: 0,
        computer_ship_coords: {},

        ships: {
            "Carrier": 5,
            "Battleship": 4,
            "Cruiser": 3,
            "Submarine": 3,
            "Destroyer": 2,
        },
        computer_ships: {
            "Carrier": 5,
            "Battleship": 4,
            "Cruiser": 3,
            "Submarine": 3,
            "Destroyer": 2,
        },

        state: "setup",
        custom_ships: false,
    };
}

function SetupMode() {
    page_list[0].style.display = "none";
    page_list[1].style.display = "flex";

    play_button.disabled = true;

    UpdateSettings();
}

let difficulty_radio_buttons = document.getElementsByClassName("diff");
let mode_radio_buttons = document.getElementsByClassName("mode");
let custom_checkbox = document.getElementsByClassName("custom-checkbox");

function UpdateSettings() {
    for (let i = 0 ; i < difficulty_radio_buttons.length ; i++) {
        if (difficulty_radio_buttons[i].checked) {
            Game["difficulty"] = difficulty_radio_buttons[i].value;
            break;
        }
    }
    for (let i = 0 ; i < mode_radio_buttons.length ; i++) {
        if (mode_radio_buttons[i].checked) {
            Game["mode"] = mode_radio_buttons[i].value;
            break;
        }
    }
    if (custom_checkbox[0].checked) {
        Game.custom_ships = true;
    }

    if (Game.custom_ships) {
        SetUpCustomShips();
    } else {
        DrawSetupGrid();
    }
}

function SetUpCustomShips() {
    return; //TODO
}

let setup_number_coords = document.getElementsByClassName("number-coords-container")[0];
let setup_letter_coords = document.getElementsByClassName("letter-coords-container")[0];

let letters = "ABCDEFGHIJ";

let setup_grid = document.getElementById("setup-grid");

let new_ship = true;
let ship_name_span = document.getElementById("ship-name");
let ship_len_span = document.getElementById("ship-length");
let ships_left_span = document.getElementById("ships-left");

let cells = [];
let endpoints = [];
let all_ship_coords = [];
function DrawSetupGrid() { 
    let new_ship_number = Game.player_ship_count;
    let new_ship_name = Object.keys(Game.ships)[new_ship_number];
    let new_ship_len = Object.values(Game.ships)[new_ship_number];

    ship_name_span.innerHTML = new_ship_name;
    ship_len_span.innerHTML = new_ship_len;
    ships_left_span.innerHTML = 5 - new_ship_number;

    let ship_origin;
    
    for (let i = 0 ; i < 10 ; i++) {
        let new_number_div = document.createElement("div");
        let new_letter_div = document.createElement("div");

        new_number_div.setAttribute("class", "coord number-coord");
        new_letter_div.setAttribute("class", "coord letter-coord");

        new_number_div.innerHTML = i + 1;
        new_letter_div.innerHTML = letters[i];

        setup_number_coords.appendChild(new_number_div);
        setup_letter_coords.appendChild(new_letter_div);
    }
    for (let i = 0 ; i < 100 ; i++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");

        cell.index = i;
        setup_grid.appendChild(cell);

        cells.push(cell);
        
        cell.onclick = function PlaceShips() {
            if (Game.state !== "setup") {
                return;
            }
            if (new_ship === true) {
                new_ship = false;
                
                ship_origin = this.index;

                if (all_ship_coords.includes(this.index)) {
                    new_ship = true;
                    return;
                }
                
                DrawPoint(this.index, false, cells);
                
                endpoints = CheckAllowedEndpoints(this.index, new_ship_len);
                
                for (let i = 0 ; i < endpoints.length ; i++) {
                    for (let j = 0 ; j < endpoints[i].length ; j++) {
                        DrawPoint(endpoints[i][j], true, cells);
                    }
                }
            } else {
                for (let i = 0 ; i < cells.length ; i++) {
                    if (cells[i].firstChild && cells[i].firstChild.temp === true) {
                        let circle = document.getElementById(i);
                        cells[i].removeChild(circle);
                    }
                }
                if (!endpoints.flat().includes(this.index)) {
                    let initial_circle = document.getElementById(ship_origin);
                    if (cells[ship_origin].firstChild) {
                        cells[ship_origin].removeChild(initial_circle);
                    }
                }
                else {
                    for (let i = 0 ; i < endpoints.length ; i++) {
                        if (endpoints[i].includes(this.index)) {
                            let ship_points = [];
                            for (let j = 0 ; j < endpoints[i].length ; j++) {
                                all_ship_coords.push(endpoints[i][j]);
                                DrawPoint(endpoints[i][j], false, cells);
                                
                                ship_points.push(endpoints[i][j]);
                            }
                            ship_points.push(ship_origin);
                            Game.player_ship_coords[new_ship_name] = ship_points;
                            
                            all_ship_coords.push(ship_origin);
                        }
                    }
                    if (Game.player_ship_count < 4) {
                        Game.player_ship_count++;
                    } else {
                        ship_name_span.innerHTML = "All Ships Placed";
                        ship_len_span.innerHTML = "Press Play to Start Battle";
                        ships_left_span.innerHTML = 0;

                        Game.player_ship_count++;

                        Game.state = "battle";
                        new_ship = false;

                        SetupComputerShips();
                        play_button.disabled = false;

                        return;
                    }

                    new_ship_number = Game.player_ship_count;
                    new_ship_name = Object.keys(Game.ships)[new_ship_number];
                    new_ship_len = Object.values(Game.ships)[new_ship_number];

                    ship_name_span.innerHTML = new_ship_name;
                    ship_len_span.innerHTML = new_ship_len;
                    ships_left_span.innerHTML = 5 - new_ship_number;
                }
                new_ship = !new_ship;
            }
        }
    }
}

function DrawPoint(index, temp, grid) {
    let circle = document.createElement("div");
    circle.setAttribute("id", index);
    circle.temp = temp;
    if (!temp) {
        circle.setAttribute("class", "circle");
    } else {
        circle.setAttribute("class", "circle circle-temp-colour");
    }

    grid[index].appendChild(circle);
}

function CheckAllowedEndpoints(index, len) {
    let x = IndexToXY(index)[0];
    let y = IndexToXY(index)[1];
    
    let len_to_add = len - 1;

    let all_possible_placements = [];
    
    if ((x + len_to_add) < 10) {
        let points = [];
        for (let i = 1 ; i < len ; i++) {
            points.push(index + i);
        }
        all_possible_placements.push(points);
    }
    if ((x - len_to_add) > -1) {
        let points = [];
        for (let i = 1 ; i < len ; i++) {
            points.push(index - i);
        }
        all_possible_placements.push(points);
    }
    if ((y + len_to_add) < 10) {
        let points = [];
        for (let i = 1 ; i < len ; i++) {
            points.push(index + (i * 10));
        }
        all_possible_placements.push(points);
    }
    if ((y - len_to_add) > -1) {
        let points = [];
        for (let i = 1 ; i < len ; i++) {
            points.push(index - (i * 10));
        }
        all_possible_placements.push(points);
    }
    
    for (let i = 0 ; i < all_possible_placements.length ; i++) {
        for (let j = 0 ; j < all_possible_placements[i].length ; j++) {
            if (all_ship_coords.includes(all_possible_placements[i][j])) {
                all_possible_placements[i] = [];
            }
        }
    }
    
    return all_possible_placements;
}

function IndexToXY(index) {
    let x = index % 10;
    let y = Math.floor(index / 10);

    return [x, y];
}

function XYToIndex(x, y) {
    return x + (y * 10);
}

function SetupComputerShips() {
    let computer_coords = [];
    let computer_index = [];
    let ship_lengths = Object.values(Game.ships);

    for (let i = 0 ; i < ship_lengths.length ; i++) {
        let ship_coords = [];
        let random_origin = Math.floor(Math.random() * (10 - ship_lengths[i]));
        ship_coords.push(random_origin);
        for (let j = 1 ; j < ship_lengths[i] ; j++) {
            let next = random_origin + j;
            ship_coords.push(next);
        }
        computer_coords.push(ship_coords);
    }
    for (let i = 0 ; i < computer_coords.length ; i++) {
        let random_other = Math.floor(Math.random() * 10);
        let direction = Math.floor(Math.random() * 2);
        let index = [];
        for (let j = 0 ; j < computer_coords[i].length ; j++) {
            if (direction < 0.5) {
                index.push(XYToIndex(computer_coords[i][j], random_other));
            } else {
                index.push(XYToIndex(random_other, computer_coords[i][j]));
            }
        }
        computer_index.push(index);
    }
    let flat_computer_index = computer_index.flat();
    if (!CheckDuplicates(flat_computer_index)) {
        let ship_names = Object.keys(Game.ships);
        for (let i = 0 ; i < ship_names.length ; i++) {
            Game.computer_ship_coords[ship_names[i]] = computer_index[i];
            Game.computer_ship_count += 1;
        }
    } else {
        return SetupComputerShips();
    }
}

function CheckDuplicates(array) {
    return new Set(array).size !== array.length;
}

function Play() {
    page_list[1].style.display = "none";
    page_list[2].style.display = "flex";

    SetShipInfo();
}





















