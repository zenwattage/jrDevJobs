var CronJob = require('cron').CronJob;

const fetchGithub = require('./tasks/fetch-github');

//TODO: fetch Microsoft
//TODO: fetch Amazon

//call every minute to fetch github jobs
new CronJob('* * * * *', fetchGithub, null, true, 'America/Los_Angeles');