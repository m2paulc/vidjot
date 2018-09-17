if(process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: process.env.DATABASEURL }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' }
}