const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const buildConfig = require('./build.json');
const copy = require('copy');
const resolvedPath = path.resolve(buildConfig.buildDirectory);
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
  .then(() => buildConfig.buildFiles.map(glob => new Promise((resolve, reject) => {
    copy(glob, resolvedPath, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  })));
