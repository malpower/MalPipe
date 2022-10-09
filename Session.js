const net=require("net");
const udp=require("dgram");
const Packet=require("./Packet");
const RPacket = require("./RPacket");


class Session
{
    id=Date.now()%1000*60*60*24;
    /** @type {net.Socket} **/
    tcpSocket;
    udpInfo;
    /** @type {udp.Socket} **/
    udpSocket;
    constructor(socket, rinfo)
    {
        this.tcpSocket=socket;
        this.udpInfo=rinfo;
        this.udpSocket=udp.createSocket("udp4", (msg, rinfo)=>
        {
            console.log("xx", rinfo);
            const rpacket=new RPacket(msg);
            this.tcpSocket.write(this.descrypt(rpacket.buffer));
        });
        this.tcpSocket.on("data", (chunk)=>
        {
            const encrypted=this.encrypt(chunk);
            const s=udp.createSocket("udp4");
            this.usend(new Packet(0, this.id, encrypted));
        }).on("close", ()=>
        {
            setTimeout(()=>
            {
                const s=udp.createSocket("udp4");
                this.usend(new Packet(2, this.id));
            }, 1000);
        });
    }
    encrypt(buffer)
    {
        return buffer;
    }
    descrypt(buffer)
    {
        return buffer;
    }
    /**
     * @param {Packet} packet
     * **/
    usend(packet)
    {
        this.udpSocket.send(packet.toBuffer(), this.udpInfo.port, this.udpInfo.address);
    }
    close()
    {
        this.tcpSocket.destroy();
        this.udpSocket.close();
    }
    start()
    {
        const p=new Packet(1, this.id);
        this.usend(p);
    }
    tsend(buffer)
    {
        this.tcpSocket.write(this.descrypt(buffer));
    }

}
    
module.exports=Session;
