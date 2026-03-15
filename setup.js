const pages = document.getElementsByClassName("page");
const setupGrid = document.getElementById("setupGridWrapper");
const cellGrid = document.getElementById("setupGrid");

function newPage(pageNum) {
    for (let i = 0 ; i < pages.length ; i++) {
        pages[i].style.display = "none";
    }
    pages[pageNum].style.display = "flex";

    if (pageNum === 2) {
        createGrid(setupGrid, cellGrid);
    }
}

function createGrid(outer, inner) {
    let numRow = document.createElement("div");
    numRow.setAttribute("class", "titleRow");

    let letterCol = document.createElement("div");
    letterCol.setAttribute("class", "title titleCol");

    let letters = "ABCDEFGHIJ"
    for (let i = 0 ; i < 10 ; i++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "title titleCellRow");
        cell.textContent = i + 1;
        numRow.appendChild(cell);
    }
    for (let i = 0 ; i < 10 ; i++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "title titleCellCol");
        cell.textContent = letters[i];
        letterCol.appendChild(cell);
    }

    for (let i = 0 ; i < 100 ; i++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "gridCell");
        inner.appendChild(cell);
    }

    outer.appendChild(numRow);
    outer.appendChild(letterCol);
}