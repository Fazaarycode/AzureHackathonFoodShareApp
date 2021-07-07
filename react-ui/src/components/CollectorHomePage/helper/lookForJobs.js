async function lookForJobs() {
    let baseUrl;
    baseUrl = process.env.NODE_ENV === 'development' ?
        process.env.REACT_APP_BACKEND_DEV_ENDPOINT_URL :
        process.env.REACT_APP_BACKEND_PRODUCTION_ENDPOINT_URL;
    console.log('Requesting Jobs..')
    const jobs = await fetch(`${baseUrl}/lookForJobs`)
}

export default lookForJobs;
