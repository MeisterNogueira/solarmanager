import { useEffect, useState } from "react";
import { API_BASE_URI, buildHeaders } from "../utils/solarmanager-utils";

export function SolarElement({ data, onClick }) {
  return (
    <div onClick={() => onClick()}>
      <p>{data.data.type}</p>
    </div>
  );
}