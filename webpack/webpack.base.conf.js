const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = require('./configs/PATHS');
const PUG_LOCALS = require('../src/views/pug.locals');

const PAGES_DIR = `${PATHS.src}/views/pages/`;
const PAGES_FILES = glob.sync(`${PAGES_DIR}**/*.pug`).map((page) => {
    return page.split('/views/pages')[1];
});

const STYLES_DIR = `${PATHS.src}/${PATHS.assets}/styles`;
const STYLES_FILES = glob
    .sync(`${STYLES_DIR}/*.scss`)
    .reduce(function (obj, el) {
        obj[path.parse(el).name] = el;
        return obj;
    }, {});

const JS_DIR = `${PATHS.src}/${PATHS.assets}/js`;
const JS_FILES = glob.sync(`${JS_DIR}/*.js`).reduce(function (obj, el) {
    obj[`${path.parse(el).name}.bundle`] = el;
    return obj;
}, {});

var config = {
    externals: {
        paths: PATHS,
    },
    entry: {
        ...STYLES_FILES,
        ...JS_FILES,
    },
    output: {
        filename: './assets/js/[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                options: {
                    presets: ['@babel/preset-env'],
                },
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false, // bundle 時忽略 css 內的 url()
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.pug$/,
                use: [
                    'html-loader',
                    {
                        loader: 'pug-html-loader',
                        options: {
                            data: { ...PUG_LOCALS }, // set of data to pass to the pug render.
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
            },
        ],
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin({
            silent: true,
        }),
        new MiniCssExtractPlugin({
            filename: `assets/styles/[name].css`,
            url: false,
        }),
        new CopyWebpackPlugin([
            {
                from: `${PATHS.src}/${PATHS.assets}/images`,
                to: `${PATHS.assets}/images`,
            },
            {
                from: `${PATHS.src}/${PATHS.assets}/fonts`,
                to: `${PATHS.assets}/fonts`,
            },
            { from: `${PATHS.src}/public`, to: '' },
        ]),

        ...PAGES_FILES.map(
            (page) =>
                new HtmlWebpackPlugin({
                    template: `${PAGES_DIR}/${page}`,
                    filename: `./${page.replace(/\.pug/, '.html')}`,
                    inject: false,
                })
        ),
    ],
};

module.exports = config;
