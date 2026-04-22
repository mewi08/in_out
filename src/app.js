const express = require ('express');
const helmet = require('helmet');
const app = express();
const logger = require('./shared/utils/logger');
require('./shared/infrastructure/database');

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(helmet());

app.use(express.static('public'));
app.use(express.static('views'));

app.use('/api/user', require('./modules/users/users.routes'));
app.use('/api/attendance', require('./modules/attendance/attendance.routes'));

app.get('/', (req, res)=>{
    res.redirect('/views/index.html');
})
app.use((req, res)=>{
    res.status(404).json({ error: 'Ruta no encontrada' })
});

// Error global
app.use((err, req, res, next) => {
    logger.error(`Error no manejado: ${err.stack}`);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
});

module.exports = app;