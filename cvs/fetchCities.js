const axios = require('axios').default;

const ENV_STATE = 'PA'; //CHAMGEME to your state
const ENV_EXCLUDES_SET = new Set(['HOWELL']); //CHANGEME to cities/counties you don't want

const BOOKED = 'Fully Booked';

const buildHeaders = () => {
  return {
    headers: {
      ['User-Agent']:
        'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:85.0) Gecko/20100101 Firefox/85.0',
      ['Referer']:
        'https://www.cvs.com/immunizations/covid-19-vaccine?icid=cvs-home-hero1-link2-coronavirus-vaccine',
      ['Cookie']:
        'gbi_visitorId=ckfgqagu600012aelbz6wdcdk; utag_main=v_id:0174bfdb076000ab24b233fcfc9000052003700f0093c$_sn:3$_ss:0$_st:1613928787914$vapi_domain:cvs.com$_se:3$_pn:3%3Bexp-session$ses_id:1613926845127%3Bexp-session; AMCV_06660D1556E030D17F000101%40AdobeOrg=-330454231%7CMCIDTS%7C18680%7CMCMID%7C68817593432982756001925947618132928830%7CMCAID%7CNONE%7CMCOPTOUT-1613934045s%7CNONE%7CvVersion%7C3.1.2; _4c_mc_=77535763-7e05-4e23-a124-664894bb6d88; QuantumMetricUserID=89f6e56afe86397b6c8baff2d10137e2; DG_SID=148.75.22.83:EkoKKMe06UL8WLVwdN9vLImpohUJcdDrBp1I4meR7GQ; BVBRANDID=745bd2da-562f-4c3e-8cf9-6fb73b01411f; favorite_store=3460/37.2343/-80.4346/BLACKSBURG/VA; DYN_COOKIE=aFmVHVxjl1hfk8rEuQeGPnXo8QDIwuCJdXaCCW%2BHF0aZIDnWaWzAx149e3qNT%2F4q; mp_cvs_mixpanel=%7B%22distinct_id%22%3A%20%2217540aad90ef-0fd056ddc930988-445d6f-13c680-17540aad90f51%22%2C%22bc_persist_updated%22%3A%201603107876741%2C%22bc_id%22%3A%20874892519%7D; pe=p1; acctdel_v1=on; adh_new_ps=on; adh_ps_pickup=on; adh_ps_refill=on; buynow=off; sab_displayads=on; db-show-allrx=on; disable-app-dynamics=on; disable-sac=on; dpp_cdc=off; dpp_drug_dir=off; dpp_sft=off; getcust_elastic=on; echome_lean6=off-p0; enable_imz=on; enable_imz_cvd=on; enable_imz_reschedule_instore=off; enable_imz_reschedule_clinic=off; flipp2=on; gbi_cvs_coupons=true; ice-phr-offer=off; v3redirecton=false; mc_cloud_service=on; mc_hl7=on; mc_ui_ssr=off-p2; mc_videovisit=on; memberlite=on; pivotal_forgot_password=off-p0; pivotal_sso=off-p0; pbmplaceorder=off; pbmrxhistory=on; ps=on; refill_chkbox_remove=off-p0; rxdanshownba=off; rxdfixie=on; rxd_bnr=on; rxd_dot_bnr=on; rxdpromo=on; rxduan=on; rxlite=on; rxlitelob=off; rxm=on; rxm_phone_dob=off-p1; rxm_demo_hide_LN=off; rxm_phdob_hide_LN=on; rxm_rx_challenge=on; s2c_akamaidigitizecoupon=on; s2c_digitizecoupon=on; s2c_dmenrollment=off-p0; s2c_herotimer=off-p0; s2c_papercoupon=off-p0; s2c_persistEcCookie=on; s2c_smsenrollment=on; s2cHero_lean6=on; sft_mfr_new=on; sftg=on; show_exception_status=on; v2-dash-redirection=on; ak_bmsc=B2DDD653C2F459C7D8ED4DB20CC4ABB3D1AA7176A37E0000BC91326076006778~pl5sf+/9WQyGDbOUyhjHWPmy9HYE88RjlueTEEZOeyC0EqDXqZRnLtWpHc+o756AOONjg77zQaTcPoOLO7TJfbxRPdZJJvjiZMP5yx53saWHIgyBljE+5uv9UpsdRnjCk/rc6OJTZL8FSlb3pc25nqHTPBnGzOVJy2NbZ0iaXEb+In/TLPKpP+/8s4TozPcUeOsHkEJ6hP3Qy64yEhzu66bATtgNmXcxHsxZM8S9VKs/M=; akavpau_vp_www_cvs_com_vaccine=1613927444~id=f100238f567d7845e5b3cfabdccee7cc; bm_sz=D9A605354501E763024399FF74ED7856~YAAQdnGq0XQuArZ3AQAAv0iJxQqEi8yAKsr0NZ5Hl8pPravnwKW8ePIXAnXqxOqvHmoHoaKp1Kgm79lk6+C7kRU7BPcW3oyvr77TaXChrUvrZbZKvZkfTHABRtNUCB5Owv5bJCzDLD7Mm73B4ky529qjPJRXD3VI0osnOwOlthV+FTgzME+HV3bts/3g; _abck=3B0A561DC428512C834C52E13B05BDBC~0~YAAQdnGq0XcuArZ3AQAABU6JxQW5JkGc9g4+9+joZxcivXDb4fiRsdHTyb40gd9Ig/jN0fwWfYEE0J6/NoRgGV3+tR3xknASVf22tQTOgaSo/wfFLGd/CXe6ZYzH83RzUbtacdXZMx22OmgGrDMrFopaUAe/VKXCyiOSWPWk5rGnCB87Kdv1q4rH8VjM3l1q8mW8/u6X3bjVL6iWtyjSb4ap/L0xvlz8Yw5tPugGq74c9VPQmOBm9bGZbdRnkyyS8ykw27OMcQTuk5uBUjE2c+FI8UxiGQSCqEqQub9TNECgn5Ltb075PB2fTmONrEE81Kz1RJhdTPVmnXfnVlEGL8iv5A==~-1~||-1||~-1; akavpau_www_cvs_com_general=1613927272~id=80ef5ee9ec49ee2417cd95b6fd9ddd90; bm_sv=22E8675DCA226BD755EEBAF556BEEB46~clfxKGTnK9pcvZ2+FkYlgi37fZZlh862UyPY5G4Hhni/nL6V/Vk6UfWHDv5nQ57tXpOY4fUU6x7pYJlMfNbNBti+CmzUjg1eynyUE79yA3O72kJU3wGcykn6dkWD1KnIfPN6OcbqFEkBdAVQbYjySg==; DG_IID=F0F11DF0-1233-3EC4-8402-153F558E4604; DG_UID=3AD4BCB5-0FEA-3D1C-A7C0-13EDC1D5CF0A; DG_ZID=45CE0EA4-276F-31B7-9FB2-4CE823A36057; DG_ZUID=445611CE-AB03-367F-A2A0-5A2BA40AB8CA; DG_HID=AAE931C3-36D4-3677-AFA1-46DA7EF191E3; AMCVS_06660D1556E030D17F000101%40AdobeOrg=1; gpv_e5=cvs%7Cdweb%7Cimmunizations%7Ccovid-19-vaccine%7Cpromo%3A%20covid-19%20vaccines%20in%20virginia%20modal; gpv_p10=www.cvs.com%2Fimmunizations%2Fcovid-19-vaccine; s_cc=true; QuantumMetricSessionID=a9cd610016546198c3e3420977f4fb97; s_sq=%5B%5BB%5D%5D; aat1=off-p1; _group1=quantum; gbi_sessionId=cklfediyi00002a8n40x0k98x; _gcl_au=1.1.1388947294.1613926850; QuantumMetricSessionLink=https://cvs.quantummetric.com/#/users/search?autoreplay=true&qmsessioncookie=a9cd610016546198c3e3420977f4fb97&ts=1613883650-1613970050; CVPF=CT-USR',
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

const findAvailableCities = (vaccineData) => {
  if (!vaccineData) {
    return [];
  }
  const filtered = vaccineData.filter((v) => {
    return v.status !== BOOKED && !ENV_EXCLUDES_SET.has(v.city);
  });

  return filtered;
};

const fetchAvailableCities = async (url) => {
  return axios
    .get(url, buildHeaders())
    .then((resp) =>
      findAvailableCities(
        traverseObject(resp, `data.responsePayloadData.data.${ENV_STATE}`)
      )
    )
    .catch((e) => console.log(e));
};

module.exports.fetchVaccineAvailableCities = async (url) => {
  return fetchAvailableCities(url)
    .then((cities) => {
      cities.forEach((c) => console.log(`~~~AVAILABILITY: ${c.city}`));
      return cities;
    })
    .catch((e) => {
      console.error(e);
    });
};

// // Load the AWS SDK for Node.js
// var AWS = require('aws-sdk');
// // Set region
// AWS.config.update({region: 'REGION'});

// // Create publish parameters
// var params = {
//   Message: 'TEXT_MESSAGE', /* required */
//   PhoneNumber: 'E.164_PHONE_NUMBER',
// };

// // Create promise and SNS service object
// var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

// // Handle promise's fulfilled/rejected states
// publishTextPromise.then(
//   function(data) {
//     console.log("MessageID is " + data.MessageId);
//   }).catch(
//     function(err) {
//     console.error(err, err.stack);
//   });
