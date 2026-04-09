function formatWorkedTime(totalMinutes) {
    const minutes = Math.floor(totalMinutes);

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return {
        hours,
        minutes: remainingMinutes
    };
}

module.exports = { formatWorkedTime };