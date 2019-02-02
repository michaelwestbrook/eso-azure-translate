const localVersion = require('./package.json').version;
const { exec } = require('child_process');
const semver = require('semver');

return new Promise((resolve, reject) => {
  // Check that the version is bumped.
  exec('npm show eso-azure-translate version', (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      reject(error);
    } else if (semver.lte(localVersion, stdout)) {
      reject(`Cannot publish version ${localVersion}. Published version is ${stdout}.`)
    } else {
      resolve();
    }
  });
})
  .catch(error => {
    console.error(`##vso[task.complete result=Failed;]${error}`);
    process.exit(1);
  });
