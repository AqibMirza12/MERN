import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

 const DUMMY_PLACES = [
    {
        Id: 'p1',
        title: 'Empire State Building',
        Description: 'Skyscraper',
        imageUrl: 'https://untappedcities-wpengine.netdna-ssl.com/wp-content/uploads/2015/07/Flatiron-Building-Secrets-Roof-Basement-Elevator-Sonny-Atis-GFP-NYC_5.jpg',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: {
            lat: 40.7470252,
            lng: -73.9948182
        },
        creator: 'u1'
    },
    {
        Id: 'p2',
        title: 'Empire State Building',
        Description: 'Skyscraper',
        imageUrl: 'https://untappedcities-wpengine.netdna-ssl.com/wp-content/uploads/2015/07/Flatiron-Building-Secrets-Roof-Basement-Elevator-Sonny-Atis-GFP-NYC_5.jpg',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: {
            lat: 40.7470252,
            lng: -73.9948182
        },
        creator: 'u2'
    }
];

const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    return <PlaceList items={loadedPlaces} />;
};


export default UserPlaces;