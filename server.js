const RPacket=require("./r_packet");
const SPacket=require("./s_packet");
const net=require("net");
const udp=require("dgram");
const conf=require("./config");

console.log(`
*==============================================*
*                 Mal Pipe Server              *
*    v0.0.1                                    *
*    author: malpower                          *
*    password: ${conf.password}${" ".repeat(32-conf.password.length)}*
*                                              *
*                      ^.=                     *
*                                              *
*==============================================*


`);

const server=net.createServer((socket)=>
{
    const proxy=net.connect({host: conf.proxyAddress,port: conf.proxyPort},()=>
    {
        let cache=Buffer.alloc(0);
        socket.on("data",async (chunk)=>
        {
            cache=Buffer.concat([cache,chunk]);
            if (RPacket.verifyCache(cache))
            {
                let len=RPacket.getPacketLength(cache);
                let packet=cache.slice(0,len);
                cache=cache.slice(len);
                packet=new RPacket(packet);
                proxy.write(await packet.getBuffer());
            }
        }).on("error",()=>
        {
            proxy.end();
        }).on("end",()=>
        {
            proxy.end();
        });

        proxy.on("data",async (chunk)=>
        {
            let packet=new SPacket(chunk);
            socket.write(await packet.getBuffer());
        }).on("end",()=>
        {
            socket.end();
        });
    });
    proxy.on("error",()=>
    {
        socket.end();
    });
});

server.listen(conf.serverPort,()=>
{
    console.log(`Server is now on port: ${conf.serverPort}`);
});

const dnsServer=net.createServer((socket)=>
{
    let cache=Buffer.alloc(0);
    let r=udp.createSocket("udp4");
    r.bind();
    r.on("message",async (message,info)=>
    {
        console.log(message.toString());
        let packet=new SPacket(message);
        socket.write(await packet.getBuffer());
        socket.end();
    }).on("error",()=>
    {
        //
    });
    socket.on("data",async (chunk)=>
    {
        cache=Buffer.concat([cache,chunk]);
        if (RPacket.verifyCache(cache))
        {
            let packet=new RPacket(cache.slice(0,RPacket.getPacketLength(cache)));
            r.send(await packet.getBuffer(),53,conf.dnsServerAddress);
            socket.removeAllListeners("data");
        }
    }).on("error",()=>
    {
        //
    });
});

dnsServer.listen(conf.serverDnsPort,()=>
{
    console.log(`DNS service is now running on port: ${conf.serverDnsPort}`);
});