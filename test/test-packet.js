const {test}=require("ava");
const Packet=require("../packet");
const TicketChecker=require("../ticket-checker");


test("test if the file exists",t=>
{
    t.pass();
});

test("test if we can construct an instance of packet",t=>
{
    let pack=new Packet;
    if (pack)
    {
        t.pass();
    }
    else
    {
        t.fail();
    }
});

test("test if we can construct an instance of packet with a buffer.",t=>
{
    let pack=new Packet(Buffer.alloc(10));
    if (pack)
    {
        if (pack.getContent().length===10)
        {
            return t.pass();
        }
        t.fail();
    }
    else
    {
        t.fail();
    }
});
test("test if we can change the content of a packet",t=>
{
    let pack=new Packet;
    let buff=Buffer.alloc(10);
    pack.setContent(buff);
    t.is(10,pack.getContent().length);
});


test("test if set the packet token",t=>
{
    let pack=new Packet;
    try
    {
        pack.token=100;
    }
    catch (e)
    {
        return t.fail();
    }
    t.pass();
});

test("test if we can read the default token of a packet",t=>
{
    let pack=new Packet;
    t.is(typeof(pack.token),"number");
});
test("test if we the default token of a packet is between 0~255",t=>
{
    for (let i=0;i<100;i++)
    {
        let pack=new Packet;
        if (pack.token-256>=0)
        {
            return t.fail();
        }
    }
    t.pass();
});

test("test if we the default token of a packet is integer",t=>
{
    for (let i=0;i<100;i++)
    {
        let pack=new Packet;
        if (!Number.isInteger(pack.token))
        {
            return t.fail();
        }
    }
    t.pass();
});

test("if we can't set an invalid data into packet.token",t=>
{
    let pack=new Packet;
    try
    {
        pack.token="sdlkfjsdlf";
    }
    catch (e)
    {
        return t.pass();
    }
    t.fail();
});

test("test if we can get the same value after we set a value to the token property",t=>
{
    let pack=new Packet;
    for (let i=0;i<100;i++)
    {
        pack.token=i;
        t.is(i,pack.token);
    }
});

test("test if we can get an error when passing an invalid value on token to the constructor of Packet",t=>
{
    try
    {
        let pack=new Packet(Buffer.alloc(10),"sdlkfj");
    }
    catch (e)
    {
        return t.pass();
    }
    t.fail();
});

test("test if we will not get an error when passing a valid value on token to the constructor of Packet",t=>
{
    try
    {
        let pack=new Packet(Buffer.alloc(10),3);
    }
    catch (e)
    {
        return t.fail();
    }
    t.pass();
});

test("test if we will not get an error when passing an invalid integer on token to the constructor of Packet",t=>
{
    try
    {
        let pack=new Packet(Buffer.alloc(10),300);
    }
    catch (e)
    {
        return t.pass();
    }
    t.fail();
});

test("test if we can get the same value if we passing a token to the constructor",t=>
{
    let pack=new Packet(Buffer.alloc(0),25);
    t.is(25,pack.token);
});

test("test if we can get a buffer with correct length of via getEncryptedPacket",t=>
{
    let pack=new Packet;
    let buffer=Buffer.from([1,2,3,4,5,6]);
    pack.setContent(buffer);
    let res=pack.getEncryptedPacket();
    t.is(res.length,buffer.length+5);
});

test("test if we can get a buffer with correct value of via getEncryptedPacket",t=>
{
    let pack=new Packet;
    let buffer=Buffer.from([1,2,3,4,5,6]);
    pack.setContent(buffer);
    let res=pack.getEncryptedPacket();
    res=res.slice(5);
    let tc=new TicketChecker;
    res=tc.transform(res,pack.token);
    t.deepEqual(res,buffer);
});

test("test if we can get a buffer with correct value of via constructor",t=>
{
    let pack=new Packet;
    let buffer=Buffer.from([1,2,3,4,5,6]);
    pack.setContent(buffer);
    let res=pack.getEncryptedPacket();
    res=res.slice(5);
    let pack2=new Packet(res,pack.token);
    t.deepEqual(buffer,pack2.content);
});