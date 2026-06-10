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

function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const sidebarClose = document.getElementById('sidebar-close');

  if (!hamburger || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.add('sidebar--open');
    overlay.classList.add('overlay--visible');
  }

  function closeSidebar() {
    sidebar.classList.remove('sidebar--open');
    overlay.classList.remove('overlay--visible');
  }

  hamburger.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
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

function initCreateDate() {
  const createdDateInput = document.getElementById('create-date');
  if (!createdDateInput) return;

  const today = new Date().toISOString().split('T')[0];
  createdDateInput.value = today;
}

function initUserFilters() {
  const searchInput = document.getElementById('user-search');
  const roleSelect = document.getElementById('filter-role');
  const tbody = document.getElementById('user-table-body');
  if (!tbody) return;

  function filterUsers() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const role = roleSelect ? roleSelect.value : '';

    const rows = tbody.querySelectorAll('.data-table__row');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('.data-table__cell');
      const name = cells[0] ? cells[0].textContent.toLowerCase() : '';
      const email = cells[1] ? cells[1].textContent.toLowerCase() : '';
      const rowRole = cells[2] ? cells[2].textContent : '';

      const matchesSearch = !query || name.includes(query) || email.includes(query);
      const matchesRole = !role || rowRole === role;

      row.style.display = matchesSearch && matchesRole ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterUsers);
  if (roleSelect) roleSelect.addEventListener('change', filterUsers);
}

function initUserActions() {
  const tbody = document.getElementById('user-table-body');
  if (!tbody) return;

  tbody.addEventListener('click', (event) => {
    const btn = event.target.closest('.action-btn');
    if (!btn) return;

    const row = btn.closest('.data-table__row');
    if (!row) return;

    const nameCell = row.querySelector('.data-table__cell');
    const name = nameCell ? nameCell.textContent : '';

    if (btn.classList.contains('action-btn--danger')) {
      if (confirm(`Er du sikker på, at du vil slette ${name}?`)) {
        row.remove();
      }
    } else {
      alert(`Redigér bruger: ${name}`);
    }
  });
}

function init() {
  initTableRows();
  initMobileNav();
  initModal();
  initCreateDate();
  initUserFilters();
  initUserActions();
}

init();
