class Packet
{
    constructor(buffer)
    {
        if (!(buffer instanceof Buffer))
        {
            throw new TypeError("Packet must be instanced with a buffer.");
        }
        this.buffer=buffer;
    }
    getBuffer()
    {
        return this.buffer;
    }
    append(buffer)
    {
        this.buffer=Buffer.concat(this.buffer,buffer);
    }
}
module.exports=Packet;