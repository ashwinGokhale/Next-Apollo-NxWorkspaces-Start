// module.exports = {
//     publicRuntimeConfig: {
//         NODE_ENV: process.env.NODE_ENV || 'development',
//         BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000'
//     }
// };

const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');
const lessToJS = require('less-vars-to-js');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// fix: prevents error when .css/.less files are required by node
if (typeof require !== 'undefined') {
    // tslint:disable: no-empty
    require.extensions['.less'] = () => {};
    require.extensions['.css'] = () => {};
}

const themeVariables = lessToJS(
    readFileSync(
        resolve(__dirname, '../../libs/assets/theme.less'),
        'utf8'
    )
);

module.exports = withPlugins(
    [
        [
            withLess,
            {
                lessLoaderOptions: {
                    javascriptEnabled: true,
                    modifyVars: themeVariables // make your antd custom effective
                }
            }
        ]
    ],
    {
        publicRuntimeConfig: {
            NODE_ENV: process.env.NODE_ENV || 'development',
            BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000'
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        webpack: (config, { isServer }) => {
            config.plugins.push(
                new FilterWarningsPlugin({
                    exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
                })
            );

            if (isServer) {
                const antStyles = /antd\/.*?\/style.*?/;
                const origExternals = [...config.externals];
                config.externals = [
                    (context, request, callback) => {
                        if (request.match(antStyles)) return callback();
                        if (typeof origExternals[0] === 'function') {
                            origExternals[0](context, request, callback);
                        } else {
                            callback();
                        }
                    },
                    ...(typeof origExternals[0] === 'function'
                        ? []
                        : origExternals)
                ];

                config.module.rules.unshift({
                    test: antStyles,
                    use: 'null-loader'
                });
            }
            return config;
        }
    }
);
