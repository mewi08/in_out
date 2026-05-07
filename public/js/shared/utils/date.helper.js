/**
 * SHARED — Date Helpers
 * Utilidades de formato de fecha sin lógica de negocio.
 */

export function formatDate(date) {
    return new Date(date).toLocaleDateString('es-PE', {
        day:   '2-digit',
        month: 'short',
        year:  'numeric',
    });
}