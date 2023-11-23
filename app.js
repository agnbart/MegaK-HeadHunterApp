const express = require('express');
const app = express();

app.get('/', function (req, res, next) {
    res.json({
        'status': 'Sukces!'
    });
});

app.listen(3000, function () {
    console.log('Listening!');
})