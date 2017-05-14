const {test}=require("ava");
const TicketChecker=require("../ticket-checker");



test("test if the ticket-checker.js exists.",t=>
{
    if (TicketChecker)
    {
        return t.pass();
    }
    t.fail();
});

test("test if the ticket-checker has a method to encode a buffer",t=>
{
    let tc=new TicketChecker;
    if (tc.transform)
    {
        return t.pass();
    }
    t.fail();
});

test("test if we can get the correct value via tranform by passing 0 as the token",t=>
{
    let tc=new TicketChecker;
    let buf=Buffer.from([0,1,2,3,4]);
    buf=tc.transform(buf,0);
    let results=[17,16,19,18,21];
    for (let i=0;i<buf.length;i++)
    {
        if (buf[i]!==results[i])
        {
            t.fail(i);
        }
    }
    t.pass();
});

test("test if we can get the correct value via tranform by passing 66 as the token",t=>
{
    let tc=new TicketChecker;
    let buf=Buffer.from([0,1,2,3,4]);
    buf=tc.transform(buf,66);
    let results=[0,1,2,3,4];
    for (let i=0;i<buf.length;i++)
    {
        if ((buf[i]^17^66)!==results[i])
        {
            t.fail(i);
        }
    }
    t.pass();
});

test("test if we can transform the transformed array back.",t=>
{
    let tc=new TicketChecker;
    let buf=Buffer.from([0,1,2,3,4]);
    buf=tc.transform(buf,66);
    buf=tc.transform(buf,66);
    let results=[0,1,2,3,4];
    for (let i=0;i<buf.length;i++)
    {
        if (buf[i]!==results[i])
        {
            t.fail(i.toString()+":"+buf[i]+":"+results[i]);
        }
    }
    t.pass();
});