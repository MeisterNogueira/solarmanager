const fs = require('fs');
const { SolarElement, isValidElementType } = require('./element.js');

const CONFIG_FILE = "./config.json";

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
    }

    function populate(element) {
        let { pos, type } = getElementValidPositionAndType(element);
        if (pos == null || type == null) return;
        let solarElement = new SolarElement(element);
        board[pos.x][pos.y] = solarElement;

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
            return { x: pos[0], y: pos[1] };
        }

        function getElementValidType(type) {
            return isValidElementType ? type : null;
        }
    }

    function printBoard() {
        for (let i = 0; i < lines; i++) {
            let line = "[";
            for (let j = 0; j < columns; j++) {
                let type = board[i][j] ? board[i][j].type : "Empty";
                line = line.concat(` ${type} `);
                line = fill(type, line);
                if (j + 1 != columns) {
                    line = line.concat(`,`);
                }
            }
            console.log(`${line.concat("]")}`);
        }

        function fill(type, line) {
            const maxElementTypeLength = 5;
            if (type.length < maxElementTypeLength) {
                let spaces = maxElementTypeLength - type.length;
                for (let i = 0; i < spaces; i++) {
                    line = line.concat(" ");
                }
            }
            return line;
        }
    }
}