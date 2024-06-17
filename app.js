require('dotenv').config();

const express=require('express');
const methodOverride = require('method-override');
const expresslayout=require('express-ejs-layouts');

const cookieParser=require('cookie-parser');

const session = require('express-session');

const MongoStore=require('connect-mongo');
const { isActiveRoute } = require('./server/helpers/routeHelpers');
const connectDB=require('./server/config/db');
const app=express();

const PORT= 5000 || process.env.PORT;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
  }));
// middlewares in this

app.use(express.static('public'));

app.use(expresslayout);

app.set('layout','./layout/main');

app.set('view engine','ejs');

app.locals.isActiveRoute = isActiveRoute; 

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));

app.listen(PORT,()=>{
console.log("Server running");
});