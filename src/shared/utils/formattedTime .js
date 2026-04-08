function formatWorkedTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
        hours,
        minutes,
        formatted: `${hours}h ${minutes}m`
    };
}

module.exports = { formatWorkedTime };