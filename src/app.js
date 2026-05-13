const express = require ('express');
const helmet = require('helmet');
const app = express();
const {logError} = require('./shared/infrastructure/logger');
const { Response } = require('./shared/core/http/response');
require('./shared/infrastructure/database');

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(helmet());

app.use(express.static('public'));
app.use(express.static('views'));

app.use('/api/user', require('./modules/users/users.routes'));
app.use('/api/attendance', require('./modules/attendance/attendance.routes'));
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/activity-logs', require('./modules/activity_log/activity_log.routes'));

app.get('/', (req, res)=>{
    res.redirect('/views/index.html');
})

app.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.statusCode = 404;
    next(error);
});

// Error global
app.use((err, req, res, next) => {
    logError('Unhandled error:', err);
    return Response.sendError(res, err);
});


module.exports = app;