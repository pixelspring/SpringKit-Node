/**
 * GET /
 */

// exports.index = function(req, res) {
//   res.render('home', {
//     title: 'Home'
//   });
//
// };

exports.index = function(req, res) {

    res.format({
      'text/plain': function(){
        res.send('plain');
      },

      'text/html': function(){
        res.render('home', {
            title: 'Home'
        });
      },

      'application/json': function(){
        res.send({ message: 'json' });
      },

      'default': function() {
        // log the request and respond with 406
        res.status(406).send('Not Acceptable');
      }
    });

};