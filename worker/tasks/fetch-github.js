

const fetch = require('node-fetch');

var redis = require("redis"),
    client = redis.createClient();

const { promisify } = require('util');

const setAsync = promisify(client.set).bind(client);

const baseURL = 'https://jobs.github.com/positions.json';


async function fetchGithub() {


    let resultCount = 1, onPage = 0;
    //hold results from api
    const allJobs = [];

    //repeat until we get an empty page
    while (resultCount > 0) {

        const res = await fetch(`${baseURL}?page=${onPage}`);
        const jobs = await res.json();
        //flattening the array with a spread operator
        allJobs.push(...jobs);
        resultCount = jobs.length;
        console.log('got', resultCount, ' jobs');
        onPage++;

    }



    console.log('got', allJobs.length, ' jobs total');

    //filter out senior and manager jobs
    const jrJobs = allJobs.filter(job => {
        const jobTitle = job.title.toLowerCase();
        let isJunior = true;


        //sort through titles that include non-junior job titles
        // ie. senior, .sr, manager, or architect
        if (
            jobTitle.includes('senior') ||
            jobTitle.includes('manager') ||
            jobTitle.includes('sr.') ||
            jobTitle.includes('architect')
        ) {
            return false;
        }
        return true;

    })

    console.log("filtered down to : ", jrJobs.length);



    const success = await setAsync('github', JSON.stringify(jrJobs));

    console.log({ success });


}


module.exports = fetchGithub;