const express = require('express');
const pug = require('pug');

const PORT = 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/user', (req, res) => {
res.render('users/index')
})

app.listen(PORT, ()=>{
    console.log('Servidor iniciado en el puerto: ' + PORT);
})