import { useEffect, useState } from "react";
import { API_BASE_URI, buildHeaders } from "../utils/solarmanager-utils";
import { SolarElement } from "./SolarElement";

export function SolarElementsMap(
  { setSelectedId, changingPosition, setPosition, setSun, fetchElements, setFetchElements }
) {

  const [fetchBoard, setFetchBoard] = useState(true);
  const [board, setBoard] = useState(null);

  const [elements, setElements] = useState(null);

  useEffect(() => {
    if (!fetchBoard) return;

    const uri = `${API_BASE_URI}/board`;
    const headers = buildHeaders('GET');

    const getBoard = async () => {
      try {
        const response = await fetch(uri, headers);
        const json = await response.json();
        //console.log(json);
        setBoard(json);
      } catch (error) {
        console.log("error", error);
      }
    }

    setFetchBoard(false);
    getBoard();
  }, [fetchBoard]);

  useEffect(() => {
    if (!fetchElements) return;
    console.log("fetching elements");

    const uri = `${API_BASE_URI}/board/elements`;
    const headers = buildHeaders('GET');

    const getElements = async () => {
      try {
        const response = await fetch(uri, headers);
        const json = await response.json();
        //console.log(json);
        setElements(json);
        findAndSetSun(json);
      } catch (error) {
        console.log("error", error);
      }
    }

    function findAndSetSun(elements) {
      const sun = elements.find(element => element.data.type == "Sun");
      if (sun)
        setSun(sun);
    }

    setFetchElements(false);
    getElements();
  }, [fetchElements]);

  function createBoard() {
    let gridTotal = board.columns * board.lines;
    let blocks = Array.apply(null, Array(gridTotal));

    function findElement(i) {
      let element = elements.find(element =>
        element.data.position.x == (i % board.columns) &&
        element.data.position.y == (Math.trunc(i / board.lines))
      )
      return element ?
        <SolarElement
          data={element}
          onClick={() => {
            if (element.data.type != "Sun")
              setSelectedId(element.id);
          }}
        /> : <></>
    }

    function logPosition(i) {
      if (changingPosition) {
        setPosition(`${i % board.columns}, ${Math.trunc(i / board.lines)}`);
      }
    }

    return (
      <div className="board" style={{ gridTemplateColumns: `repeat(${board.columns}, 1fr)` }}>
        {blocks.map((block, i) =>
          <div key={i}
            className="solarElement"
            onClick={() => logPosition(i)}
          >
            {findElement(i)}
          </div>
        )}
        <div></div>
      </div>
    );
  }

  return (
    <>
      <h2>Board</h2>
      {board && elements ? createBoard() : <></>}
    </>
  );
}