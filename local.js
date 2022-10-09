const udp=require("dgram");
const net=require("net");
const Session=require("./Session");
const config=require("./config");

const sessions=new Map();

const server=net.createServer((socket)=>
{
    console.log("LLL");
    const session=new Session(socket, config.remote);
    session.start();
});

server.listen(config.local.port);