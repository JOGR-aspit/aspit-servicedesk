function openModal(ticketId) {
  const modal = document.getElementById('edit-modal');
  const idDisplay = document.getElementById('modal-id');
  const titleInput = document.getElementById('modal-title');
  const typeSelect = document.getElementById('modal-type');
  const descriptionInput = document.getElementById('modal-description');
  const locationInput = document.getElementById('modal-location');
  const statusSelect = document.getElementById('modal-status');
  const prioritySelect = document.getElementById('modal-priority');
  const assignedSelect = document.getElementById('modal-assigned');
  const createdDateDisplay = document.getElementById('modal-created-date');

  const row = document.querySelector(`tr[data-ticket-id="${ticketId}"]`);
  if (row) {
    if (idDisplay) idDisplay.value = `#${ticketId}`;
    if (titleInput) titleInput.value = row.dataset.title || '';
    if (typeSelect) typeSelect.value = row.dataset.type || '';
    if (descriptionInput) descriptionInput.value = row.dataset.description || '';
    if (locationInput) locationInput.value = row.dataset.location || '';
    if (statusSelect) statusSelect.value = row.dataset.status || '';
    if (prioritySelect) prioritySelect.value = row.dataset.priority || '';
    if (assignedSelect) assignedSelect.value = row.dataset.assigned || '';
    if (createdDateDisplay) createdDateDisplay.value = row.dataset.createdDate || '';
  }

  modal.setAttribute('data-current-ticket-id', ticketId);
  modal.classList.add('modal--open');
  document.body.classList.add('modal-open');
}

function closeModal() {
  const modal = document.getElementById('edit-modal');
  modal.classList.remove('modal--open');
  modal.removeAttribute('data-current-ticket-id');
  document.body.classList.remove('modal-open');
}

function initTableRows() {
  const tbody = document.getElementById('ticket-table-body');
  if (!tbody) return;

  tbody.addEventListener('click', (event) => {
    const row = event.target.closest('tr');
    if (!row) return;
    const id = row.getAttribute('data-ticket-id');
    openModal(id);
  });

  tbody.addEventListener('keydown', (event) => {
    const row = event.target.closest('tr');
    if (!row) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const id = row.getAttribute('data-ticket-id');
      openModal(id);
    }
  });
}

function initModal() {
  const closeBtn = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('modal-cancel');
  const modal = document.getElementById('edit-modal');

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('modal')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });
}

(function init() {
  initTableRows();
  initModal();
})();
