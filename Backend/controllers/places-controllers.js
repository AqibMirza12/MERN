const { v4: uuidv4 } = require('uuid'); //unique ID package
const { validationResult } = require('express-validator');

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

const getPlaceById = (req, res, next) => { //linked to App.js placesRoute
    const placeId = req.params.pid; // {pid; 'p1'}
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId; //executes on all elements of array
    });

    if(!place)
    {
        throw new HttpError('Could not find a place for the provided Id', 404);
    }

    res.json(place); //set json convert function, can accept many types of args
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const places = DUMMY_PLACES.filter(p => { //filter returns a new array
        return p.creator === userId;
    });

    if(!places || places.length === 0) {
        return next(new HttpError('Could not find places for the provided Id', 404));
    }

    res.json({places});
};

const createPlace = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        throw new HttpError('Invalid inputs passed, please check your data', 422); //422 - invalid response
    }

    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        title, //shortcut as value is equal
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace); //unshift(first element), push(last element)

    res.status(201).json({place: createdPlace});
};

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        throw new HttpError('Invalid inputs passed, please check your data', 422); //422 - invalid response
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId); //findIndex for array values
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace});
};

const deletePlace = (req,res, next) => {
    const placeId = req.params.pid;
    if(!DUMMY_PLACES.find(p => p.id === place))
    {
        throw new HttpError('Could not find a place for that Id', 404);
    } 
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id === placeId);
    res.status(200).json({message: 'Deleted place.'});
};

//alternative export syntax,  will be bundled as one object
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;