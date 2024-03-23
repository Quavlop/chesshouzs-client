const isAuthenticated = async (API_URL, payload, ingame = false, gameID = '') => {

    if (ingame ){
        const getResponse = await fetch(API_URL + `/auth/fe-auth?ingame=1&game_id=${gameID}`, {
            method : "GET",
            credentials : 'include',
            headers : {
                Cookie : `__SESS_TOKEN=${payload}`
            }
        });
    
        const response = await getResponse.json();
        return response;
    }        


    const getResponse = await fetch(API_URL + '/auth/fe-auth', {
        method : "GET",
        credentials : 'include',
        headers : {
            Cookie : `__SESS_TOKEN=${payload}`
        }
    });

    const response = await getResponse.json();
    return response;
}

export default isAuthenticated;