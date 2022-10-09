const Packet=require("./Packet");


class RPacket extends Packet
{
    /** @param {Buffer} buffer **/
    constructor(buffer)
    {
        const type=buffer.readUInt16BE(0);
        const id=buffer.readUInt32BE(2);
        const length=buffer.readUInt32BE(6);
        const data=buffer.subarray(10);
        super(type, id, data);
    }
}

module.exports=RPacket;