const express = require('express')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars').engine;
const path = require('path');
const dotenv = require('dotenv')
dotenv.config();

const app = express()
const port = process.env.PORT || 3000;

const route = require('./routes');
const db = require('./config/db');
const { equal } = require('assert');


app.use(express.static(path.join(__dirname, 'public'))); //static file

//connect to db
db.connect();

//parse body
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

//cookie parser
app.use(cookieParser());

//HTTP logger
app.use(morgan('combined'));

//template engine
app.engine(
    "hbs",
    exphbs({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            getCountOfPosts: (posts) => posts ? posts.length : 0,
            getFirstImage: (images) => images && images.length > 0 ? images[0] : '',
            equal: (a, b) => {
                if (a == b) return true;
                return false;
            },
        },
    }),
)
app.set('view engine', 'hbs');
app.set('views', './views');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})