    const path = require('path');
    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const AureliaWebpackPlugin = require('aurelia-webpack-plugin');
    const project = require('./package.json');

    const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';
    const DEBUG = ENV !== 'production';
    const metadata = {
        port: process.env.WEBPACK_PORT || 9000,
        host: process.env.WEBPACK_HOST || 'localhost',
        ENV: ENV,
        HMR: process.argv.join('').indexOf('hot') >= 0 || !!process.env.WEBPACK_HMR
    };
    const outDir = path.resolve('dist');

    const aureliaModules = [
        'aurelia-bootstrapper-webpack',
        'aurelia-binding',
        'aurelia-dependency-injection',
        'aurelia-event-aggregator',
        'aurelia-framework',
        'aurelia-history',
        'aurelia-history-browser',
        'aurelia-loader',
        'aurelia-loader-webpack',
        'aurelia-logging',
        'aurelia-logging-console',
        'aurelia-metadata',
        'aurelia-pal',
        'aurelia-pal-browser',
        'aurelia-path',
        'aurelia-polyfills',
        'aurelia-route-recognizer',
        'aurelia-router',
        'aurelia-task-queue',
        'aurelia-templating',
        'aurelia-templating-binding',
        'aurelia-templating-router',
        'aurelia-templating-resources'
    ];

    module.exports = {
        entry: {
            app: [], // <-- this array will be filled by the aurelia-webpack-plugin
            aurelia: aureliaModules
        },
        output: {
            path: outDir,
            filename: DEBUG ? '[name].bundle.js' : '[name].[chunkhash].bundle.js',
            sourceMapFilename: DEBUG ? '[name].bundle.map' : '[name].[chunkhash].bundle.map',
            chunkFilename: DEBUG ? '[id].chunk.js' : '[id].[chunkhash].chunk.js'
        },
        resolve: {
            modules: [path.resolve(), 'node_modules'],
            alias:
              { 'utilities': path.resolve(__dirname, 'src/utilities/')
              , 'authConfig': path.resolve(__dirname, 'src/authConfig/index.js')
              , 'fa': 'font-awesome/css/font-awesome.css'
              , 'valueConverters': path.resolve(__dirname, 'src/valueConverters/index.js')
              }

        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/, // or include: path.resolve('src'),
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            [ 'es2015', {
                                loose: true, // this helps simplify javascript transformation
                                module: false // this helps enable tree shaking for webpack 2
                            }],
                            'stage-1'
                        ],
                        plugins: ['transform-decorators-legacy']
                    }
                },
                {
                    test: /\.html$/,
                    exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
                    use: [
                        'raw-loader',
                        'html-minifier-loader'
                    ]
                },
                {
                    test: /\.(less|css)$/, // <--- This was /\.css$/ for only css
                    use: [
                        {
                            loader: 'style-loader',
                            query: {
                                singleton: !DEBUG
                            }
                        },
                        {
                            loader: 'css-loader',
                            query: {
                                minimize: !DEBUG // <--- Enable style minification if production
                            }
                        },
                        'less-loader' // <--- This was added to enable "import 'style.less'"
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)$/,
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: '[name].[ext]'
                    }
                }
            ]
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                debug: DEBUG,
                devtool: 'source-map',
                options: {
                    context: __dirname,
                    'html-minifier-loader': {
                        removeComments: true,               // remove all comments
                        collapseWhitespace: true,           // collapse white space between block elements (div, header, footer, p etc...)
                        collapseInlineTagWhitespace: true,  // collapse white space between inline elements (button, span, i, b, a etc...)
                        collapseBooleanAttributes: true,    // <input required="required"/> => <input required />
                        removeAttributeQuotes: true,        // <input class="abcd" /> => <input class=abcd />
                        minifyCSS: true,                    // <input style="display: inline-block; width: 50px;" /> => <input style="display:inline-block;width:50px;"/>
                        minifyJS: true,                     // same with CSS but for javascript
                        removeScriptTypeAttributes: true,   // <script type="text/javascript"> => <script>
                        removeStyleLinkTypeAttributes: true // <link type="text/css" /> => <link />
                    }
                }
            }),
            new webpack.ProvidePlugin({
                regeneratorRuntime: 'regenerator-runtime', // to support await/async syntax
                Promise: 'bluebird', // because Edge browser has slow native Promise object
                jQuery: 'jquery', // because 'bootstrap' by Twitter depends on jQuery
                $: 'jquery' // just an alias
            }),
            new AureliaWebpackPlugin({
                root: path.resolve(),
                src: path.resolve('src')
            }),
            new HtmlWebpackPlugin({
                template: 'index.html',
                inject: 'head'
            }),
            new webpack.optimize.CommonsChunkPlugin({ // to eliminate code duplication across bundles
                name: ['aurelia']
            })
        ].concat(DEBUG ? [

        ] : [
            /**
            * Plugin: DedupePlugin
            * Description: Prevents the inclusion of duplicate code into your bundle
            * and instead applies a copy of the function at runtime.
            *
            * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
            * See: https://github.com/webpack/docs/wiki/optimization#deduplication
            */
            new webpack.optimize.DedupePlugin(),

            new webpack.optimize.UglifyJsPlugin({
                mangle: { screw_ie8: true, keep_fnames: true },
                dead_code: true,
                unused: true,
                comments: true,
                compress: {
                    screw_ie8: true,
                    keep_fnames: true,
                    drop_debugger: false,
                    dead_code: false,
                    unused: false,
                    warnings: false
                }
            })
        ]),
        devServer: {
            port: metadata.port,
            host: metadata.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
        }
    };
