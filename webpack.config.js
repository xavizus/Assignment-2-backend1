const path = require('path');

module.exports = {
    mode: 'development',
    entry: [
        './src/javascript/rateings.js',
        './src/javascript/login.js',
        './src/javascript/createAccount.js' 
    ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public/javascripts'),

    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
      },
};