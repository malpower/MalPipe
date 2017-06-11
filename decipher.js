const crypto=require("crypto");
const conf=require("./config");



class Cipher
{
    constructor()
    {
        this.decipher=crypto.createDecipher("aes192",conf.password);
    }
    decrypt(buffer)
    {
        if (!(buffer instanceof Buffer))
        {
            throw new TypeError("buffer must be a buffer!");
        }
        let result=Buffer.alloc(0);
        return new Promise((success,fail)=>
        {
            this.decipher.on("data",(chunk)=>
            {
                result=Buffer.concat([result,chunk]);
            }).on("end",()=>
            {
                success(result);
            }).on("error",(e)=>
            {
                fail(e);
            });
            this.decipher.write(buffer);
            this.decipher.end();
        });
    }
}


module.exports=Cipher;