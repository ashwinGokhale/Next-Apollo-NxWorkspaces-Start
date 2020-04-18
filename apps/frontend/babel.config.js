module.exports = (api) => {
    api.cache(true);

    const presets = ['next/babel'];
    const plugins = [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['import', { libraryName: 'antd', style: true }]
    ];
    return {
        plugins,
        presets
    };
};
