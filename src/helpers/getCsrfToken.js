const getCsrfToken = async (API_URL) => {
    const retrieveCsrfToken = await fetch(API_URL + '/gen-csrf-form-guard/secure-token', {
      method : "GET",
      credentials : 'include',
  });
    const csrfResponse = await retrieveCsrfToken.json();
    const { token : csrf_token = '' } = csrfResponse;
    return csrf_token;
}

export default getCsrfToken;

