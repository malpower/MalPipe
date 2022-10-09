class Packet
{
    buffer;
    type=0;
    constructor(type, id=0, data=Buffer.alloc(0))
    {
        this.buffer=data;
        this.type=type;
    }
    toBuffer()
    {
        let b=Buffer.alloc(10);
        b.writeUInt16BE(this.type, 0);
        b.writeUInt32BE(this.buffer.length, 2);
        b.writeUInt32BE(this.id, 6);
        b=Buffer.concat([b, this.buffer]);
        return b;
    }
}

module.exports=Packet;