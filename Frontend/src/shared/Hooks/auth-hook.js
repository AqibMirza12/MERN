import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
  
    const login = useCallback((uid, token, expirationDate) => {
      //preventing infinte loops, stops above function from being re-created
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //+ 1 hour token authentication
        setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString(), //ISOString prevents data loss when conversion process starts
        })
      );
      setUserId(uid);
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null); 
      setUserId(null);
      localStorage.removeItem("userData"); //remove from localstorage token after logout
    }, []);
  
    useEffect(() => {
      if(token && tokenExpirationDate) {
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime(); //calculating duration in ms
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer); //cancel/clear ongoing timer
      }
    }, [token, logout, tokenExpirationDate]);
  
    useEffect(() => {
      //after rerender cycle
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration) > new Date() //valid token check
      ) {
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
      }
    }, [login]);

    return { token, login, logout, userId };
}