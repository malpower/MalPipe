const RPacket=require("./r_packet");
const SPacket=require("./s_packet");
const net=require("net");
const udp=require("dgram");
const dnsServer=udp.createSocket("udp4");
const conf=require("./config");

console.log(`
*==============================================*
*                 Mal Pipe Client              *
*    v0.0.1                                    *
*    author: malpower                          *
*    password: ${conf.password}${" ".repeat(32-conf.password.length)}*
*                                              *
*                      ^.=                     *
*                                              *
*==============================================*


`);



dnsServer.bind(53,"0.0.0.0");
dnsServer.on("data",(message,info)=>
{
    let packet=new SPacket(message);
    let socket=net.connect({host: conf.serverAddress,port: conf.serverDnsPort},async ()=>
    {
        let cache=Buffer.alloc(0);
        socket.on("data",(chunk)=>
        {
            cache=Buffer.concat([cache,chunk]);
        }).on("end",async ()=>
        {
            let p=new RPacket(cache);
            let s=udp.createSocket("udp4");
            s.bind();
            s.send(await p.getBuffer(),info.port,info.address);
        });
        socket.write(await packet.getBuffer());
    });
    socket.on("error",(e)=>
    {
        console.error(e.stack);
    });
});

const server=net.createServer(async (socket)=>
{
    let remote=net.connect({host: conf.serverAddress,port: conf.serverPort},async ()=>
    {
        let cache=Buffer.alloc(0);
        remote.on("data",async (chunk)=>
        {
            cache=Buffer.concat([cache,chunk]);
            if (RPacket.verifyCache(cache))
            {
                let len=RPacket.getPacketLength(cache);
                let packet=cache.slice(0,len);
                cache=cache.slice(len);
                packet=new RPacket(packet);
                socket.write(await packet.getBuffer());
            }
        }).on("end",()=>
        {
            socket.end();
        });

        socket.on("data",async (chunk)=>
        {
            let packet=new SPacket(chunk);
            remote.write(await packet.getBuffer());
        }).on("error",()=>
        {
            remote.end();
        }).on("end",()=>
        {
            remote.end();
        }); 
    });
    remote.on("error",()=>
    {
        socket.end();
    });
    
});

server.listen(conf.clientPort,()=>
{
    console.log(`Server is now running on port: ${conf.clientPort}`);
});




