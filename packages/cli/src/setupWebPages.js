const { copyFileSync } = require('fs');
const { resolve } = require('path');

// destination.txt will be created or overwritten by default.
copyFileSync(resolve(__dirname, '../node_modules/d3/dist/d3.min.js'), resolve(__dirname, './template/scripts/d3.min.js'));
copyFileSync(resolve(__dirname, '../node_modules/d3-ez/build/d3-ez.css'), resolve(__dirname, './template/d3-ez.css'));
copyFileSync(resolve(__dirname, '../node_modules/d3-ez/build/d3-ez.min.js'), resolve(__dirname, './template/scripts/d3-ez.min.js'));