var path = require('path');

module.exports = function (app, passport) {

    // Controllers
    var HomeController = require(path.join(__dirname, '../controllers/home'));
    var userController = require(path.join(__dirname, '../controllers/user'));
    var contactController = require(path.join(__dirname, '../controllers/contact'));
    var apiController = require(path.join(__dirname, '../controllers/api'));

    app.get('/', HomeController.index);
    app.get('/contact', contactController.contactGet);
    app.post('/contact', contactController.contactPost);
    app.get('/account', userController.ensureAuthenticated, userController.accountGet);
    app.put('/account', userController.ensureAuthenticated, userController.accountPut);
    app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
    app.get('/signup', userController.signupGet);
    app.post('/signup', userController.signupPost);
    app.get('/login', userController.loginGet);
    app.post('/login', userController.loginPost);
    app.get('/forgot', userController.forgotGet);
    app.post('/forgot', userController.forgotPost);
    app.get('/reset/:token', userController.resetGet);
    app.post('/reset/:token', userController.resetPost);
    app.get('/logout', userController.logout);
    app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));
    app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email profile repo' ] }));
    app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }));

    /**
     * API Routes:
     */
    app.get('/api', apiController.index);

    // Server Monitor:
    // https://github.com/RafalWilinski/express-status-monitor
    // http://127.0.0.1:3000/status
    app.use(require('express-status-monitor')({

        title: 'App Status',    // Default title
        path: '/status',        // Path to status page
        spans: [{
            interval: 1,        // Every second
            retention: 60       // Keep 60 datapoints in memory
        }, {
            interval: 5,        // Every 5 seconds
            retention: 60
        }, {
            interval: 15,       // Every 15 seconds
            retention: 60
        }]

    }));

}