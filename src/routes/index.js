const homeRoute = require('./home');
const loginRoute = require('./login');
const logoutRoute = require('./logout');
const registerRoute = require('./register');
const profileRoute = require('./profile');
const followingRoute = require('./following');
const postRoute = require('./post');

const testRoute = require('./test');

function routes(app) {
    app.use('/post', postRoute)
    app.use('/following', followingRoute)
    app.use('/profile', profileRoute)
    app.use('/test', testRoute)
    app.use('/register', registerRoute)
    app.use('/login', loginRoute)
    app.use('/logout', logoutRoute)
    app.use('/', homeRoute)
}

module.exports = routes;