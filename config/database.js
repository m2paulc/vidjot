if(process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://<dbuser>:<dbpassword>@ds123822.mlab.com:23822/vidsjot-prod' }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' }
}