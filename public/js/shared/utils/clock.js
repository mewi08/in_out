export function startClock(timeId, dateId = null) {
    function updateTime() {
        const now = new Date();

        const timeString = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const timeElement = document.getElementById(timeId);
        if (timeElement) {
            timeElement.textContent = timeString;
        }

        if (dateId) {
            const dateString = now.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            const dateElement = document.getElementById(dateId);
            if (dateElement) {
                dateElement.textContent =
                    dateString.charAt(0).toUpperCase() + dateString.slice(1);
            }
        }
    }

    updateTime();
    setInterval(updateTime, 1000);
}

