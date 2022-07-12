const axios = require('axios').default;
const CronJob = require('cron').CronJob;
const moment = require('moment');

const BASE_URL = 'https://www.riteaid.com/services/ext/v2/vaccine/checkSlots';

//CHANGEME - Add your Rite Aid stores here... I didn't go as far as using riteaid API to get them
// you can find them easily by searching in: https://www.riteaid.com/pharmacy/apt-scheduler
// for stores in your area
// [STORE_NUMBER, STORE_ADDRESS]
const STORE_MAP = new Map([
  ['3527', '155 Chartiers Avenue, McKees Rocks, PA 15136'],
  ['10939', '4411 Howley Street, Pittsburgh, PA 15224'],
  ['274', '1700 Murray Avenue, Pittsburgh, PA 15217'],
  ['10914', '1700 Pine Hollow Road., McKees Rocks, PA 15136'],
  ['10909', '1710 Mount Royal Blvd., Glenshaw, PA 15116'],
  ['10907', '2100 Washington Pike, Carnegie, PA 15106'],
  ['4682', '100 William Marks Drive, Munhall, PA 15120'],
]);

const buildHeaders = () => {
  return {
    headers: {
      ['User-Agent']:
        'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:85.0) Gecko/20100101 Firefox/85.0',
      ['Referer']: 'https://www.riteaid.com/pharmacy/apt-scheduler',
    },
  };
};

const traverseObject = (o, path) => {
  try {
    const pieces = path.split('.');
    let currentLocation = o;
    pieces.forEach((piece) => {
      currentLocation = currentLocation[piece];
    });
    return currentLocation;
  } catch (error) {
    console.error('Big oof');
    return undefined;
  }
};

const isAvailable = (slotData) => {
  return slotData === true;
};

const hasAvailability = async (storeNumber) => {
  const url = `${BASE_URL}?storeNumber=${storeNumber}`;
  return axios
    .get(url, buildHeaders())
    .then((resp) => isAvailable(traverseObject(resp, `data.Data.slots.1`)))
    .catch((e) => {
      console.log(e);
      return false;
    });
};

const fetchAvailableLocations = async () => {
  const availabilityPromises = [];

  STORE_MAP.forEach(async (address, storeNumber) => {
    availabilityPromises.push(
      hasAvailability(storeNumber).then((a) => {
        if (a) {
          return address;
        }
        return null;
      })
    );
  });

  const results = await Promise.all(availabilityPromises);
  const availableAddresses = results.filter((r) => r !== null);
  if (availableAddresses.length) {
    availableAddresses.forEach((addr) => {
      console.log(`AVAILABILITY AT: ${addr}`);
    });
  }
};

// fetchAvailableLocations();
const job = new CronJob('*/20 * * * * *', () => {
  console.log(`Polling - ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
  fetchAvailableLocations();
});
job.start();
