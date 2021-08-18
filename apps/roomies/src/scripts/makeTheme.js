const fs = require('fs');
const jsonToCssVariables = require('json-to-css-variables');
const path = require('path');

const json = require(path.resolve(__dirname, '../app/theme.config.json'));

const options = {
  element: ':root',
  pretty: true
}


const target = path.resolve(__dirname, '../styles/theme-css-variables.scss');
const cssString = jsonToCssVariables(json, options);

fs.writeFileSync(target, cssString);
