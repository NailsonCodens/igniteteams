import io from 'socket.io-client';

let baseURL = 'https://d0ec-201-15-38-159.ngrok.io';


const socketio = io(baseURL);

console.log(socketio);

socketio.on("connect_error", (err: { message: any; }) => {
  console.log(`connect_error due to ${err.message}`);
}); 



console.log('executou');
export default socketio;