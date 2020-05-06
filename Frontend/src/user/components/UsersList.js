import React from 'react';
import './UsersList.css';
import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';

const UsersLists = props => {
    if(props.items.length === 0) {
        return <div className="center">
            <Card>
            <h2>No Users found.</h2>
            </Card>
        </div>
};

        return <ul className="user-list">
        {props.items.map(user => {
            return <UserItem 
            key={user.id} 
            id={user.id} 
            image={user.image} 
            name={user.name} 
            placeCount={user.places.length} //display number of places for a given user
            />
        })
        }
    </ul>
};

export default UsersLists;