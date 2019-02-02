module.exports = (buildDirectory) => {
  const fs = require('fs');
  const path = require('path');
  const rimraf = require('rimraf');
  const buildConfig = require('./');
  const resolvedPath = path.resolve(buildDirectory);
  return new Promise((resolve, reject) => {
    fs.exists(resolvedPath, exists => {
      if (exists) {
        rimraf(resolvedPath, error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        })
      } else {
        resolve();
      }
    });
  })
    .then(() => new Promise((resolve, reject) => {
      fs.mkdir(resolvedPath, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      })
    }))
    .then(() => new Promise((resolve, reject) => {
      fs.copyFile('./index.js', `${resolvedPath}/index.js`, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }));
}

module.exports('./build');