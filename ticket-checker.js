class TicketChecker
{
    constructor()
    {
        this.firstToken=17;
    }
    transform(buffer=undefined,token=0)
    {
        if (buffer===undefined)
        {
            throw new TypeError(`"Buffer" must be a buffer.`);
        }
        for (let i=0;i<buffer.length;i++)
        {
            let v=buffer.readUInt8(i);
            v=v^this.firstToken;
            v=v^token;
            buffer.writeUInt8(v,i);
        }
        return buffer;
    }
}

module.exports=TicketChecker;
