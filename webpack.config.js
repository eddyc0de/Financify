var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./src/js/index.js'],
    output: {
        filename: 'js/bundle.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: 'dist',
    },
    plugins: [new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './index.html'
    })],
    module: {
        rules: [
            {
                test:/\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};