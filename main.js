const koa = require('koa');
const app = new koa();

const names = ['Carlos', 'World', 'Johnny'];
const rand = () => Math.floor(Math.random() * 3);
const randomName = () => names[Math.floor(Math.random() * 3)];

const dbCall = async() => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(randomName());
        }, rand() * 1000);
    });
}

app.use(async(ctx, next) => {
    // Step 1: Log start date
    const start = new Date;
    console.log(`Started at: ${start}`);
    await next(); // Step 2:  Go to the next middleware, the execution of the next two lines is paused
    // Step 7: Do stuff after body is set and Step 6 
    const ms = new Date - start;
    console.log(`Method: ${ctx.method}, URL: ${ctx.url} - Elapsed: ${ms}ms`);
});

app.use(async(ctx, next) => {
    // Step 3: Do stuff
    console.log(`Hey, I'm just another middleware`);
    await next(); // Step 4: Go to the next middleware, the execution of the next line is paused
    // Step 6: Do stuff after body is set
    console.log('More stuff after body has been set');
});

app.use(async(ctx) => {
    const name = await dbCall();
    // Step 5: Body is set, "bubble" up, since there are no more next() calls
    ctx.body = `Hello ${name}`;
    console.log('Body has been set');
});

app.listen(3000);