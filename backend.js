const http = require('http');
const {Server} = require('socket.io');
const fs = require('fs')

const serverHttp = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    return fs.createReadStream("./fronted.html").pipe(res);
});

const io = new Server(serverHttp);

io.on('connection',(socket) =>{

    socket.groups = [];

    socket.on('unirseGrupo', (sala) => { 
        if(!socket.groups.includes(sala) && sala != ''){
            socket.groups.push(sala)
            socket.join(sala);
        }
    });

    socket.on('salirGrupo',(sala) => {
        if(socket.groups.includes(sala)){
                socket.groups = socket.groups.filter((element) => element != sala)
                socket.leave(sala);
            } 
    });

    socket.on('mandarBroadCast',(mensaje) => {
        if(mensaje != '')
            io.emit('broadcast', mensaje);
    });


    socket.on('mandarGrupo',(data) => {
        const {sala, mensaje} = JSON.parse(data);
        if(socket.groups.includes(sala)){
            socket.to(sala).emit(sala, {mensaje,sala});
        }
    });

});

serverHttp.listen(3000, () => {
    console.log('Servidor corriendo port 3000')
});