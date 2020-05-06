const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');

const placesController = require('./controllers/places-controllers');
const userRoutes = require('./routes/user-routes');
const placesRoutes = require('./routes/places-routes'); //import file

const app = express();

app.use(bodyParser.json());

app.use((req,res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //setting header on response
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access=Control-Allow-Methods', 'GET, POST, PATCH, DELETE'); //CORS security resolution
    next();
});

app.use('api/users', userRoutes);

app.use('/api/places', placesRoutes); // => /api/places..., first paramater is filter, second is a reference to an imported file

app.use((req,res, next) => {
    const error = new HttpError('Could not find this route.', 404); //proper error handling
    throw error;
});

app.use((error, req, res, next) => {
   if(res.headerSent) {
       return next(error);
   }
   res.status(error.code || 500); //And condition, if an error code is not returned then a 500 code is returned
   res.json({message: error.message || 'An Unknown error occurred'}); 
});

app.listen(5000);
