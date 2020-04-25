const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {

  entry: __dirname + "/src/index.js", // webpack entry point. Module to start building dependency graph


  output: {
	path: __dirname + '/dist/mainPage', // Folder to store generated bundle
    filename: 'bundle.js',  // Name of generated bundle after build
    publicPath: '/mainPage/' // public URL of the output directory when referenced in a browser
  },


  module: {  // where we defined file patterns and their loaders
      rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
            loader: "babel-loader"
            }
          },
          {
            test: /\.css$/i,
            use: [
             // The `injectType`  option can be avoided because it is default behaviour
                  { loader: 'style-loader', options: { injectType: 'styleTag' } },
                  'css-loader'
                 ]
          },
		  {
			 test: /\.(png|jpe?g|gif)$/i,
			 use: [
				{
				 loader: 'file-loader',
				},
			 ],
		  },
			{
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      }
		]
  },


  plugins: [  // Array of plugins to apply to build chunk
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
		  filename: "index.html",
          template: __dirname + "/public/index.html",
          inject: 'body',
		  alwaysWriteToDisk: true
      }),	new HtmlWebpackHarddiskPlugin()
  ],
  devServer: {  // configuration for webpack-dev-server
    contentBase:  "dist/mainPage",  //source of static assets
    port: 7700, // port to run dev-server
    disableHostCheck: true  


  }

};
