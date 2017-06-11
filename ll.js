const Cipher=require("./cipher");

(async function()
{
    let c=new Cipher;
    let res=await c.encrypt(Buffer.from("SLKFJ"));
    console.log(res.toString("hex"));
})();