const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const path = require('path')
var CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const extractCSS = new ExtractTextPlugin('[name].fonts.css')
const extractSCSS = new ExtractTextPlugin('[name].styles.css')
const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
	output: {
		filename: 'main-[hash].js',
		chunkFilename: '[name].[hash].js'
	},
	plugins: [new MiniCssExtractPlugin()],
	module: {
		rules: [
			{
				test: /\.(js|jsx|ico)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.(css|sass|scss)$/,
				use: [
				  {
					loader: 'style-loader'
				  },
				  {
					loader: 'css-loader'
				  },
				  {
					loader: 'sass-loader'
				  }
				]
			  },
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: { minimize: true }
					}
				]
			},
			{
				test: /\.(png|jpg|gif|ico)$/,
				use: [
					{
						loader: 'file-loader',
						options: {},
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|svg|webp|ico)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css', '.scss']
	},
	plugins: [
		new webpack.DefinePlugin({ // <-- key to reducing React's size 
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		//new BundleAnalyzerPlugin(),
		new CompressionPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.ico$|\.js$|\.css$|\.scss$|\.html$/,
			threshold: 10240,
			minRatio: 0
		}),
		new webpack.NamedModulesPlugin(),
		new HtmlWebPackPlugin({
			template: 'src/index.html',
			filename: './index.html',
			favicon: 'src/logos/pimerce.ico'
		}),
		new MiniCssExtractPlugin({
			filename: isDevelopment ? '[name].css' : '[name].[hash].css',
			chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
		})
	]
}