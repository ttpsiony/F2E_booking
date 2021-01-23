const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'production',
	entry: ['@babel/polyfill', path.join(__dirname, 'public', 'index.js')],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/',
	},
	devtool: 'none',
	resolve: {
		modules: [path.resolve(__dirname, 'src'), 'node_modules'],
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
				enforce: 'pre',
			},
			{
				test: /\.css$/i,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							import: true,
							sourceMap: true,
							modules: {
								localIdentName: '[name]__[local]--[hash:base64:5]',
							},
							importLoaders: 1,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								ident: 'postcss',
								plugins: [require('autoprefixer')()],
							},
						},
					},
				],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							import: true,
							sourceMap: true,
							modules: {
								localIdentName: '[local]--[sha256:hash:base64:10]',
							},
							importLoaders: 2,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass'),
							sourceMap: true,
							sassOptions: {
								webpackImporter: true,
								indentedSyntax: true,
								indentWidth: 4,
								import: true,
							},
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				loader: 'url-loader?limit=102400&name=images/[name].[ext]',
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				loader: 'file-loader',
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html',
			inject: 'body',
		}),
	],
};
