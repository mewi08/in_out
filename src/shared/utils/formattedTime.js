function formatWorkedTime(totalMinutes) {
    const minutes = Math.floor(totalMinutes);

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return {
        hours,
        minutes: remainingMinutes
    };
}
function formatDateISO(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function formatTime24(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

module.exports = { formatWorkedTime, formatDateISO, formatTime24 };