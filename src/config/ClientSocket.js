import socketIOClient from "socket.io-client";

const ENDPOINT = 'http://localhost:8000';
const socket = socketIOClient(ENDPOINT);

export default socket;