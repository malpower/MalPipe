const crypto=require("crypto");
const conf=require("./config");



class Cipher
{
    constructor()
    {
        this.cipher=crypto.createCipher("aes192",conf.password);
    }
    encrypt(buffer)
    {
        if (!(buffer instanceof Buffer))
        {
            throw new TypeError("buffer must be a buffer!");
        }
        let result=Buffer.alloc(0);
        return new Promise((success,fail)=>
        {
            this.cipher.on("data",(chunk)=>
            {
                result=Buffer.concat([result,chunk]);
            }).on("end",()=>
            {
                success(result);
            }).on("error",(e)=>
            {
                fail(e);
            });
            this.cipher.write(buffer);
            this.cipher.end();
        });
    }
}


module.exports=Cipher;