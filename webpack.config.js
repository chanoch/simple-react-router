var webpack = require('webpack');
const path = require('path');

var libraryName = 'simple-react-router';

const isProd = process.env.NODE_ENV === 'production' 
        || process.argv.slice(-1)[0] == '-p'
        || process.argv.some(arg => arg.indexOf('webpack-dev-server') >= 0);

const filename = `${libraryName}${isProd?'.min':''}.js`;

function getPlugins() {
    const plugins = [];

    // pass env to webpack
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    }));

    if(isProd) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                mangle: false
            }
        }));
    }
    return plugins;
}

module.exports = {
    mode: 'development',
    entry: {
        index: path.join(__dirname, '/src/index.js'),
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.js.?$/, loader: 'babel-loader', exclude: /node_modules/ },
        ],
    },
    externals: [
        "react",
        "react-dom"
    ],
    plugins: getPlugins()
}