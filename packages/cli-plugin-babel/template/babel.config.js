const env = process.env.NODE_ENV;

module.exports = {
    presets: [
        ['@pokemonon/babel-preset-common', { env }],
        <%_ if (library === 'vue2') { _%>
        '@vue/babel-preset-jsx',
        <%_ } else if (library === 'react') { _%>
        ['@babel/preset-react', {
            development: env === 'development',
            useBuiltIns: true,
        }],
        <%_ } _%>
    ],
    <%_ if (library === 'vue3') { _%>
    plugins: [
        '@vue/babel-plugin-jsx',
    ],
    <%_ } _%>
};