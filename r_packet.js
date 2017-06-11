const Packet=require("./packet");
const Decipher=require("./decipher");

class RPacket extends Packet
{
    constructor(buffer)
    {
        let len=buffer.readUInt32BE(0);
        if (buffer.length!==len)
        {
            throw new Error("Buffer length is not correct.");
        }
        super(buffer);
    }
    getBuffer()
    {
        return new Promise(async (success,fail)=>
        {
            let decipher=new Decipher;
            try
            {
                let result=await decipher.decrypt(this.buffer.slice(4));
                success(result);
            }
            catch (e)
            {
                fail(e);
            }
        });
    }
    static verifyCache(cache)
    {
        if (cache.length<4)
        {
            return false;
        }
        let len=cache.readUInt32BE(0);
        if (cache.length>=len)
        {
            return true;
        }
        return false;
    }
    static getPacketLength(cache)
    {
        if (cache.length<4)
        {
            throw new Error("length of cache is less than 4.");
        }
        return cache.readUInt32BE(0);
    }
}

module.exports=RPacket;