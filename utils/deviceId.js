import { v4 as uuidv4 } from "uuid";

let deviceId = localStorage.getItem("deviceId");

if (!deviceId) {
  deviceId = uuidv4();
  localStorage.setItem("deviceId", deviceId);
}

export default deviceId;

