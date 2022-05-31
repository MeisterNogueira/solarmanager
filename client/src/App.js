//import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import { API_BASE_URI, buildHeaders } from "./utils/solarmanager-utils";
import { SolarElementDetails } from './components/SolarElementDetails';
import { SolarElementsMap } from './components/SolarElementsMap';

function App() {
  const [selectedId, setSelectedId] = useState("M6lhc1kakoK5SYEXN4aq");
  const [position, setPosition] = useState(null);
  const [changingPosition, setChangingPosition] = useState(false);
  const [changingSun, setChangingSun] = useState(false);
  const [postElement, setPostElement] = useState(false);
  const [updateSun, setUpdateSun] = useState(false);

  useEffect(() => {
    if (!changingPosition) return;
    if (changingSun) setUpdateSun(true);
    else setPostElement(true);
  }, [position]);

  useEffect(() => {
    if (!postElement) return;

    const uri = `${API_BASE_URI}/board/elements`;
    const headers = buildHeaders('POST', {
      type: "House",
      position: position,
      solarPanels: 1
    });

    const createElement = async () => {
      try {
        const response = await fetch(uri, headers);
        const json = await response.json();
        console.log(json);
      } catch (error) {
        console.log("error", error);
      }
    }

    setPostElement(false);
    setChangingPosition(false);
    createElement();
  }, [postElement]);

  useEffect(() => {
    if (!updateSun) return;

    // TODO get id
    const uri = `${API_BASE_URI}/board/elements/${sunId}`;
    const headers = buildHeaders('PUT', {
      position: position,
    });

    const updateElement = async () => {
      try {
        const response = await fetch(uri, headers);
        const json = await response.json();
        console.log(json);
      } catch (error) {
        console.log("error", error);
      }
    }

    setUpdateSun(false);
    setChangingPosition(false);
    setChangingSun(false);
    updateElement();
  }, [updateSun]);

  function createHouse() {
    setChangingPosition(true);
  }

  function moveSun() {
    setChangingPosition(true);
    setChangingSun(true);
  }

  return (
    <div className="App">
      <h1>Solar Manager</h1>
      <SolarElementsMap 
        setSelectedId={setSelectedId}
        changingPosition={changingPosition}
        setPosition={setPosition}
      />
      <SolarElementDetails id={selectedId}/>
      <button onClick={createHouse}>Create House</button>
      <button onClick={moveSun}>Move Sun</button>
    </div>
  );
}

export default App;
