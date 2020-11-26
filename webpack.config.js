const path = require('path');
const common = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ],
    },
};

module.exports = [
    {
        entry: './src/index.js',
        target: 'node',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'module.js',
            library: 'URI',
            libraryTarget: 'umd'
        },
        ...common,
    },
    {
        entry: './src/uri.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'uri.min.js',
            libraryTarget: 'var',
            library: 'URI',
            libraryExport: 'default'
        },
        ...common,
    },
    {
        entry: './src/query-string.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'query-string.min.js',
            libraryTarget: 'var',
            library: 'QueryString',
            libraryExport: 'default'
        },
        ...common,
    }
];


