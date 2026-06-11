function updateColumnCounts() {
    document.querySelectorAll('.kanban-column').forEach(function(column) {
        const cards = column.querySelectorAll('.kanban-column__cards .kanban-card');
        const countEl = column.querySelector('.kanban-column__count');
        if (countEl) {
            countEl.textContent = cards.length;
        }
    });
}

document.addEventListener('DOMContentLoaded', updateColumnCounts);
