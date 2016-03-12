var mongoose = require( 'mongoose' );
var db = mongoose.connection;

mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.'.error);
    process.exit(1);
});

// --------------------------------------------------------------
// CONNECTION EVENT LOGGING
// --------------------------------------------------------------

// When successfully connected
db.on('connected', function () {
    console.log('Mongoose default connection open to '.info + process.env.MONGODB.info);
});

// If the connection throws an error
db.on('error',function (err) {
    console.log('Mongoose default connection error: '.error + err.error);
});

// When the connection is disconnected
db.on('disconnected', function () {
    console.log('Mongoose default connection disconnected'.warn);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination'.warn);
        process.exit(0);
    });
});