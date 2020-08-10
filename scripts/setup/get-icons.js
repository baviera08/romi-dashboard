'use strict';
const { exec } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const callback = (error, stdout, stderr) => {
  if (error) {
    console.error(chalk`{red exec error: ${error}}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout: ${stdout}`);
  console.log(chalk`{green The icons have been successfully obtained. Check public/assets/icons/}`);
};

let rawdata = fs.readFileSync('./.resources.json');
let data = JSON.parse(rawdata);

if (data.hasOwnProperty('url')) {
  exec('[ -d "public/assets/icons/" ] && rm -rf public/assets/icons');
  exec('mkdir -p public/assets/icons');
  exec(`svn checkout ${data.url} public/assets/icons/`, (error, stdout, stderr) =>
    callback(error, stdout, stderr),
  );
} else if (data.hasOwnProperty('path')) {
  exec('[ -d "public/assets/icons/" ] && rm -rf public/assets/icons');
  exec('mkdir -p public/assets/icons');
  exec(`cp -r ${data.path}* public/assets/icons/`, (error, stdout, stderr) =>
    callback(error, stdout, stderr),
  );
}