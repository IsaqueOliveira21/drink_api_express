import app from './app';

const port = 3000;
app.listen(port, () => {
    console.log();
    console.log('API Started!');
    console.log(`http://127.0.0.1:${port}`);
    console.log();
});