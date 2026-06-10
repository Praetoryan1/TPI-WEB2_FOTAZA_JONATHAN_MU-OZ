const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const { attachUser } = require('./middlewares/auth.middleware');
const authRoutes = require('./modules/auth/auth.routes');
const publicationRoutes = require('./modules/publications/publications.routes');
const commentsRoutes = require('./modules/comments/comments.routes');
const ratingsRoutes = require('./modules/ratings/ratings.routes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

app.use(attachUser);
app.use('/auth', authRoutes);
app.use('/publications', publicationRoutes);
app.use('/comments', commentsRoutes);
app.use('/ratings', ratingsRoutes);

app.get('/', (req, res) => {
  res.render('home/index', {
    title: 'Fotaza'
  });
});

module.exports = app;