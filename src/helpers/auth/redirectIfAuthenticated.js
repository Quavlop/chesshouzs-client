
const redirectIfAuthenticated = async (APIEndpoint, method, payload, body = null) => {

    const getResponse = await fetch(APIEndpoint, {
        method,
        credentials : 'include',
        headers : {
            Cookie : payload
        }
    });

    const response = await getResponse.json();
    return response;
}

export default redirectIfAuthenticated;