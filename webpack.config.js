module.exports = {
    entry: "./js/notes.js",
    mode: "production",
    output: {
        filename: "notes.min.js"
    },
    module: {
        rules :[
            {
                test: /\.js/,
                exclude: /node_modules/,
                loader: "babel-loader",
            }
        ]
    }
};