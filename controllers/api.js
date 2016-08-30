/**
 * GET /
 * Welcome data.
 */
exports.index = function(req, res) {
    res.json({
        message: 'Welcome to the SpringKit-Node API',
        apiVersion: '0.1',
        content: 'home'
    });
};