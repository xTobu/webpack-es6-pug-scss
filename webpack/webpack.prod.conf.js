const merge = require('webpack-merge');
const PATHS = require('./configs/PATHS');
const baseWebpackConfig = require('./webpack.base.conf');

const buildWebpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    output: {
        path: PATHS.out,
    },
    optimization: {
        // minimize: true, // minimize all entries: html, js, css
    },
});

module.exports = new Promise((resolve, reject) => {
    resolve(buildWebpackConfig);
});
