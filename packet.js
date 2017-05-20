const TicketChecker=require("./ticket-checker");

class Packet
{
    constructor(buffer,t)
    {
        if (t && (!Number.isInteger(t) || t>255 || t<0))
        {
            throw new TypeError("token must be an integer and between 0~255");
        }
        let tc=new TicketChecker;
        let token=Math.random();
        token*=1000;
        token%=256;
        token=Number.parseInt(token);
        token=t || token;
        this.content=tc.transform(buffer || Buffer.alloc(0),token);
        Object.defineProperty(this,"token",{configurable: false,get: function()
        {
            return token;
        },set: function(v)
        {
            if (!Number.isInteger(v) || v>255 || v<0)
            {
                throw new TypeError("token must be an integer with a 0~255 value");
            }
            token=v;
        }});
    }
    getContent()
    {
        return this.content;
    }
    setContent(buffer)
    {
        this.content=buffer || Buffer.alloc(0);
    }
    getEncryptedPacket()
    {
        let tc=new TicketChecker;
        let buffer=tc.transform(this.content,this.token);
        let header=Buffer.alloc(5);
        header.writeUInt32BE(buffer.length+5,0);
        header.writeUInt8(this.token,4);
        return Buffer.concat([header,buffer]);
    }
}

module.exports=Packet;