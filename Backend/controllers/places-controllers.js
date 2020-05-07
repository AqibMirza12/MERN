const { v4: uuidv4 } = require('uuid'); //unique ID package
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../Util/location');

let DUMMY_PLACES = [ //let = variable
    {
        id: uuidv4(), //unique id generation
        title: 'p1',
        title: 'Empire State Building',
        description: 'Skyscraper',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];

const getPlaceById = async (req, res, next) => { //linked to App.js placesRoute
    const userId = req.params.uid;

    let place;

    try {
        const places = await Place.findById(placeId);
    } catch (err) {
        error = new HttpError(
            'Something went wrong, could not find a place', 500
        );
        return next(error);
    }

    if(!places) {
         const error = new HttpError(
             'Could not find places for the provided Id', 
             404);
            return next(error); //stopping code execution if an error occurs
    }

    res.json({ places: place.toObject( {getters: true} ) }); //getters true returns a id of type string
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places
  
    try {
         places = await Places.find({ creator: userId });
    } catch(err) {
        const error = new HttpError(
            'Fetching places failed, please try again later', 500
        );
        return next(error);
    }  

    if (!places || places.length === 0) {
      return next(
        new HttpError('Could not find places for the provided user id.', 404)
      );
    }
  
    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return next (new HttpError('Invalid inputs passed, please check your data', 422)); //422 - invalid response
    }

    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: '',
        creator: ''
    });

    try {
    await createdPlace.save();
    } catch(err) {
        const error = new HttpError(
            'Creating place failed please try again', 500
        );
        return next(error);
    }


    res.status(201).json({place: createdPlace});
};


const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return next (new HttpError('Invalid inputs passed, please check your data', 422)); //422 - invalid response
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch(error) {
         error = new HttpError(
            'Something went wrong, could not update the place', 500
        );
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (error) {
             error = new HttpError(
                'Something went wrong, could not update place', 500
            );
            return next(error);
    }

    res.status(200).json({place: place.toObject({ getters: true })});
};

const deletePlace = async (req,res, next) => {
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch(error) {
         error = new HttpError(
            'Could not delete place, please try again later', 
            500
        );
        return next(error);
    }

    try {
       await place.remove();
    } catch (error) {
         error = new HttpError(
            'Could not delete place, please try again later', 
            500
        );
        return next(error);
    }
   
    res.status(200).json({message: 'Deleted place.'});
};

//alternative export syntax,  will be bundled as one object
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;