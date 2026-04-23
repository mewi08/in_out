/**
 * SHARED — Date Helpers
 * Utilidades de formato de fecha sin lógica de negocio.
 */

export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-PE', {
        day:   '2-digit',
        month: 'short',
        year:  'numeric',
    });
}