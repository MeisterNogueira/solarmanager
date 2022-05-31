const SCHEMA = "http";
const HOST = "localhost";
const PORT = "8080";
const API_PATH = "/solarmanager";
export const API_BASE_URI = `${SCHEMA}://${HOST}:${PORT}${API_PATH}`

export function buildHeaders(method, body) {
  return {
    method: method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQx'
    },
    body: JSON.stringify(body) ?? undefined
  }
}