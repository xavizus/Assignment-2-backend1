const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: ['./src/javascript/rateings.js', './src/javascript/main.js'],
        admin: ['./src/javascript/admin.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/javascripts'),

    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
      },
};