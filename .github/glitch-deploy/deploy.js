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


const listProject = `https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/hammerhead-clover-dead|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/broken-horse-advantage|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/better-night-quill|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/iodized-precious-aspen|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/generated-stirring-question|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/purring-piquant-lunch|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/fluff-aeolian-copper|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/garnet-dandy-fuchsia|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/fate-unequaled-mole|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/unequaled-working-laborer|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/jungle-dandy-falcon|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/feline-dent-carpet|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/raspy-pebble-naranja|https://9c6db41c-30d5-4d6e-9a77-67e453d4dad3@api.glitch.com/git/fluff-animated-reward`.trim().split('|');

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