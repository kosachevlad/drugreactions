//
// Checks the status code of a response to a 'fetch' call. If an error occurred
// then abort and throw. Else return a promise containing the response object
//
function checkApiCallStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
}

export default checkApiCallStatus;