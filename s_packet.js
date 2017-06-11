const Packet=require("./packet");
const Cipher=require("./cipher");

class SPacket extends Packet
{
    constructor(buffer)
    {
        super(buffer);
    }
    getBuffer()
    {
        return new Promise(async (success,fail)=>
        {
            let cipher=new Cipher;
            try
            {
                let result=await cipher.encrypt(this.buffer);
                let len=Buffer.alloc(4);
                len.writeUInt32BE(result.length+4,0);
                success(Buffer.concat([len,result]));
            }
            catch (e)
            {
                fail(e);
            }
        });
    }
}

module.exports=SPacket;
