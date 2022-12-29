const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/encouraging-sleepy-titanoceratops|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/titanium-remarkable-spectrum|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/lofty-juniper-newsprint|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/tan-elated-cockroach|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/malachite-calico-diabloceratops|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/shrouded-third-pocket|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/amazing-longhaired-roquefort|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/heathered-pie-cement|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/occipital-pewter-lynx|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/pacific-faithful-shift|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/nettle-curse-galette|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/spectacled-workable-termite|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/spiffy-vivacious-cheddar|https://5b599e4c-8c57-4fad-b438-5a04491fa169@api.glitch.com/git/aback-changeable-risk`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();