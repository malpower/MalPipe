const udp=require("dgram");
const Session=require("./Session");
const net=require("net");
const config=require("./config");

const sessions=new Map();

const server=udp.createSocket("udp4", (buffer, rinfo)=>
{
    console.log("HERE");
    const id=buffer.readUInt32BE(2);
    if (sessions.has(id))
    {
        sessions.get(id).tsend(buffer.subarray(10));
    }
    else
    {
        const socket=net.createConnection({host: config.target.address, port: config.target.port});
        const s=new Session(socket, rinfo);
        sessions.set(id, s);
    }
});
server.bind(config.remote.port);