const moment = require('moment');
const CronJob = require('cron').CronJob;
const Cache = require('node-cache');
const fetchVaccineAvailableCities = require('./fetchCities')
  .fetchVaccineAvailableCities;
const transporter = require('./transporter').transporter;

const ENV_STATE = 'PA'; //CHANGE_ME to your state

const url = `https://www.cvs.com/immunizations/covid-19-vaccine.vaccine-status.${ENV_STATE}.json?vaccineinfo`;

const cache = new Cache({ stdTTL: 600, checkperiod: 120 }); //cache for 10 mins;
const findNewCities = (cities) => {
  const newCities = [];
  cities.forEach((cityData) => {
    if (!cache.has(cityData.city)) {
      cache.set(cityData.city, cityData);
      newCities.push(cityData);
    }
  });
  return newCities;
};

const buildMessage = (cityBlobs) => {
  return cityBlobs.reduce((msg, cityBlob) => {
    return `${msg} | ${cityBlob.city}`;
  }, 'Vaccines available at cities:');
};

const pollVaccinesApts = async () => {
  const cityBlobs = await fetchVaccineAvailableCities(url).catch((e) => {
    return [];
  });

  const newCities = findNewCities(cityBlobs);

  if (newCities.length) {
    const mailer = await transporter.getTransporter();
    await mailer.sendMessage('Covid Availability ✔', buildMessage(cityBlobs));
    return cityBlobs;
  }
  return [];
};

//every minute: * * * * *
//every 10 seconds: */10 * * * * *
const job = new CronJob('*/10 * * * * *', () => {
  console.log(`Polling - ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
  pollVaccinesApts();
});
job.start();
// pollVaccinesApts();
