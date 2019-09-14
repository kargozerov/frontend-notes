# frontend-notes
https://frontend-notes-vuejs.herokuapp.com/

1) Создать в корне проекта package.json с параметрами по умолчанию
npm init -y

2) Установить webpack 
npm i webpack

3) Установить babel и core-js
npm i -D babel-loader @babel/core @babel/preset-env core-js@3

4) Создайте файл .babelrc, указываем, что нужно использовать полифиллы из corejs3, только по мере необходимости
```javascript
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
```
5) Создать основной конфиг для сборки  webpack.config.js
```javascript
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
```
6) npx webpack  доустанавливаем выбираем y
