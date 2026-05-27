const { DateTime } = require('luxon');

const ZONE = 'America/Lima';

function now() {
    return DateTime.now().setZone(ZONE);
}

function toLimaDate(date) {
    return DateTime.fromJSDate(new Date(date)).setZone(ZONE);
}

function formatDateISO(date) {
    if (!date) return '';
    return toLimaDate(date).toFormat('yyyy-MM-dd');
}

function formatTime24(date) {
    if (!date) return '';
    return toLimaDate(date).toFormat('HH:mm:ss');
}

module.exports = {
    now,
    formatDateISO,
    formatTime24
};