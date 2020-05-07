const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId); //has to be pointer

router.post
(
'/', 
[check('title').not().isEmpty(),
check('description').isLength({min: 5},
check('address').not().isEmpty() //express validation
)
], 
placesControllers.createPlace);

router.patch('/:pid', [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 })
] ,placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router; //exporting class