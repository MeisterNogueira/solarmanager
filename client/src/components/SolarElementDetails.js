import { useEffect, useState } from "react";
import { API_BASE_URI, buildHeaders } from "../utils/solarmanager-utils";

export function SolarElementDetails({ id }) {
  const uri = `${API_BASE_URI}/board/elements/${id}`;

  const [fetchSolarElement, setFetchSolarElement] = useState(true);
  const [updateSolarElement, setUpdateSolarElement] = useState(false);
  const [solarElement, setSolarElement] = useState(null);
  const [newSolarPanelsNumber, updateSolarPanelsNumber] = useState(0);

  useEffect(() => {
    if (!fetchSolarElement)
      setFetchSolarElement(true);
  }, [id]);

  useEffect(() => {
    if (!fetchSolarElement) return;

    const headers = buildHeaders('GET');

    const fetchElement = async () => {
      try {
        const response = await fetch(uri, headers);
        const json = await response.json();
        //console.log(json);
        setSolarElement(json);
      } catch (error) {
        console.log("error", error);
      }
    }

    setFetchSolarElement(false);
    fetchElement();
  }, [fetchSolarElement]);

  useEffect(() => {
    if (!updateSolarElement) return;

    const headers = buildHeaders('PUT', { solarPanels: newSolarPanelsNumber });

    const updateElement = async () => {
      try {
        const response = await fetch(uri, headers);
        const json = await response.json();
        //console.log(json);
        setFetchSolarElement(true);
      } catch (error) {
        console.log("error", error);
      }
    }

    setUpdateSolarElement(false);
    updateElement();
  }, [updateSolarElement]);


  function incrementSolarPanels(solarPanels) {
    updateSolarPanelsNumber(solarPanels + 1);
    setUpdateSolarElement(true);
  }

  function decrementSolarPanels(solarPanels) {
    updateSolarPanelsNumber(solarPanels - 1);
    setUpdateSolarElement(true);
  }

  return (
    <div>
      <h2>Solar Element Details</h2>
      {solarElement ?
        <>
          <p>Type: {solarElement.data.type}</p>
          <p>Solar Panels: {solarElement.data.solarPanels}</p>
          <p>Irradiance: {solarElement.data.irradiance}</p>
          <p>Power Output: {solarElement.data.powerOutput}</p>
          <button onClick={() => incrementSolarPanels(solarElement.data.solarPanels)}>+</button>
          <button disabled={solarElement.data.solarPanels == 1} onClick={() => decrementSolarPanels(solarElement.data.solarPanels)}>-</button>
        </> : <></>
      }
    </div>
  );
}