const fs = require('fs');
const { SolarElement, EmptyElement } = require('./element.js');

const CONFIG_FILE = "./config.json";
const VALID_TYPES = ["House", "Van"];

module.exports = function (lines, columns) {

    const board = createBoard(lines, columns);

    return {
        init: init,
        get: get,
        put: put
    }

    function createBoard(lines, columns) {
        return Array.from(Array(lines), () => new Array(columns));
    }

    function init() {
        const elements = readElementsFromConfigFile();
        populateBoard(elements);
        printBoard();
    }

    function get(line, column) {
        return board[line][column];
    }

    function put(element) {
        populate(element);
    }

    function readElementsFromConfigFile() {
        let data = fs.readFileSync(CONFIG_FILE);
        return JSON.parse(data);
    }

    function populateBoard(elements) {
        elements.forEach(populate);
        fillBoard();
    }

    function populate(element) {
        let { pos, type } = getElementValidPositionAndType(element);
        if (pos == null || type == null) return;
        board[pos.x][pos.y] = new SolarElement(element);

        function getElementValidPositionAndType(element) {
            return {
                pos: getElementValidPosition(element.position),
                type: getElementValidType(element.type)
            }
        }

        function getElementValidPosition(position) {
            if (position == undefined) return null;
            let pos = position.split(",", 2);
            if (pos.length != 2) return null;
            if (pos[0] < 0 || pos[0] >= lines) return null;
            if (pos[1] < 0 || pos[1] >= columns) return null;
            return {x: pos[0], y: pos[1]};
        }

        function getElementValidType(type) {
            if (type == undefined) return null;
            if (!VALID_TYPES.includes(type)) return null;
            return type;
        }
    }

    function fillBoard() {
        for (let i = 0; i < lines; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j] == undefined)
                    board[i][j] = new EmptyElement();
            }
        }
    }

    function printBoard() {
        for (let i = 0; i < lines; i++) {
            let line = "[";
            for (let j = 0; j < columns; j++) {
                line = line.concat(` ${board[i][j].type} `);
                line = fill(board[i][j], line);
                if (j + 1 != columns) {
                    line = line.concat(`,`);
                }
            }
            console.log(`${line.concat("]")}`);
        }

        function fill(element, line) {
            const maxElementTypeLength = 5;
            if (element.type.length < maxElementTypeLength) {
                let spaces = maxElementTypeLength - element.type.length;
                for (let i = 0; i < spaces; i++) {
                    line = line.concat(" ");
                }
            }
            return line;
        }
    }
}