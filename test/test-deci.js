const {test}=require("ava");


const Cipher=require("../cipher");
const Decipher=require("../decipher");



test("test if cipher can be instanced",(t)=>
{
    try
    {
        let c=new Cipher;
    }
    catch (e)
    {
        return t.fail();
    }
    t.pass();
});

test("test if decipher can be instanced",(t)=>
{
    try
    {
        let d=new Decipher;
    }
    catch (e)
    {
        return t.fail();
    }
    t.pass();
});

test("test if cipher can encryt data",async (t)=>
{
    let c=new Cipher;
    let result=await c.encrypt(Buffer.from("LKSJ"));
    t.pass();
});

test("test if decipher can decrypt data(string)",async (t)=>
{
    let d=new Decipher;
    try
    {
        let c=new Cipher;
        let result=await c.encrypt(Buffer.from("LKSJ"));
        result=await d.decrypt(result);
        t.is("LKSJ",result.toString());
    }
    catch (e)
    {
        console.log(e);
        return t.fail();
    }
});


test("test if decipher can decrypt data(buffer)",async (t)=>
{
    let d=new Decipher;
    let buff=Buffer.from([0,1,2,3,4,5,6,7]);
    try
    {
        let c=new Cipher;
        let result=await c.encrypt(buff);
        result=await d.decrypt(result);
        t.deepEqual(buff,result);
    }
    catch (e)
    {
        console.log(e);
        return t.fail();
    }
});

test("test if decipher can decrypt data(long string)",async (t)=>
{
    let d=new Decipher;
    let buff=Buffer.from("13333333333333323423423l42k34j2oi3j42o3i4j23h4 2v3i4h23i5h320 456893u50834o5h 3058t3048tj23408tj39058j3n");
    try
    {
        let c=new Cipher;
        let result=await c.encrypt(buff);
        result=await d.decrypt(result);
        t.deepEqual(buff,result);
    }
    catch (e)
    {
        console.log(e);
        return t.fail();
    }
});