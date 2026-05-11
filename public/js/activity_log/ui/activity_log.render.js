import { activityLogService } from '../app/activity_log.service.js';
export async function loadActivities() {
    try {
        const logs = await activityLogService.getRecords();

        const container =
            document.getElementById('recentActivity');

        if (!logs.length) {
            container.innerHTML = `
                <p class="text-muted mb-0">
                    No hay actividad reciente
                </p>
            `;
            return;
        }

        container.innerHTML = logs.map(log => `
            <div class="border-bottom py-2">
                <div class="fw-semibold">
                    ${log.action}
                </div>

                <div class="small text-muted">
                    ${log.description}
                </div>

                <div class="small text-secondary">
                    ${new Date(log.created_at)
                        .toLocaleString()}
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error(
            'Error cargando actividad',
            error
        );
    }
}