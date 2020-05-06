import React, { useEffect, useState } from 'react';

import UsersLists from './../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/Hooks/http-hook';

const Users = () => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
         try {
            const responseData = await sendRequest('http://localhost:5000/api/users'); //default is GET for fetch


            setLoadedUsers(responseData.users);
         } catch(err) {
             
         }

        };
        
        fetchUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (<div className="center">
                <LoadingSpinner />    
            </div>
                )}
            {isLoading && loadedUsers && <UsersLists items={loadedUsers} />}
        </React.Fragment>
    );
};

export default Users;