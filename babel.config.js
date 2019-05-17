module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    browsers: ["last 1 versions", "ie >= 10"]
                },
                modules: false,
                loose: true
            }
        ],
        "@babel/preset-react"
    ],
    plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread"
    ]
};
