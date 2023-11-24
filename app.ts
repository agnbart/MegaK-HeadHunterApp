import * as express from 'express';
export const app = express();

app.use(express.json());

app.get('/', function (req, res, next) {
    res.json({
        'status': 'Sukces!'
    });
});

app.listen(3000, function () {
    console.log('Listening!');
})