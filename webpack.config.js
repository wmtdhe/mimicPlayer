const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry:'./src/index.js',
    output: {
        filename: "bundle.js",
        path: path.join(__dirname,'/dist'),
        publicPath: "/"
    },
    module:{rules: [
            {
                test:/\.js$/i, exclude: /node_modules/, use:{loader: "babel-loader"}
            },
            {
                //check file with css extension
                //style loader first
                test:/\.css$/i,
                use:['style-loader','css-loader']
            },
            {
                test:/\.(png|jpe?g|gif)$/i, use:'file-loader'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: '@svgr/webpack',
                        options: {
                            babel: false,
                            icon: true,
                        },
                    },
                ],
            }
        ]},
    plugins:[new htmlWebpackPlugin({template: './src/index.html'})],
    devServer: {
        hot:true,
        contentBase:'./dist'
    }
}