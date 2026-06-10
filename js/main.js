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

    if (btn.classList.contains('action-btn--danger')) {
      openDeleteUserModal(row);
    } else {
      openUserModal(row.dataset.userId);
    }
  });
}

function openDeleteUserModal(row) {
  const modal = document.getElementById('user-delete-modal');
  const message = document.getElementById('user-delete-modal-message');
  if (!modal) return;

  const nameCell = row.querySelector('.data-table__cell');
  const name = nameCell ? nameCell.textContent : 'denne bruger';

  if (message) message.textContent = `Er du sikker på, at du vil slette ${name}? Denne handling kan ikke fortrydes.`;

  modal.setAttribute('data-delete-user-id', row.dataset.userId);
  modal.classList.add('modal--open');
  document.body.classList.add('modal-open');
}

function closeDeleteUserModal() {
  const modal = document.getElementById('user-delete-modal');
  if (!modal) return;
  modal.classList.remove('modal--open');
  modal.removeAttribute('data-delete-user-id');
  document.body.classList.remove('modal-open');
}

function confirmDeleteUser() {
  const modal = document.getElementById('user-delete-modal');
  if (!modal) return;

  const userId = modal.getAttribute('data-delete-user-id');
  const row = document.querySelector(`tr[data-user-id="${userId}"]`);
  if (row) row.remove();

  closeDeleteUserModal();
}

function initDeleteUserModal() {
  const closeBtn = document.getElementById('user-delete-modal-close');
  const cancelBtn = document.getElementById('user-delete-modal-cancel');
  const confirmBtn = document.getElementById('user-delete-modal-confirm');
  const modal = document.getElementById('user-delete-modal');

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeDeleteUserModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeDeleteUserModal);
  if (confirmBtn) confirmBtn.addEventListener('click', confirmDeleteUser);

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('modal')) {
      closeDeleteUserModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeDeleteUserModal();
    }
  });
}

function openUserModal(userId) {
  const modal = document.getElementById('user-edit-modal');
  if (!modal) return;

  const idInput = document.getElementById('user-modal-id');
  const nameInput = document.getElementById('user-modal-name');
  const emailInput = document.getElementById('user-modal-email');
  const passwordInput = document.getElementById('user-modal-password');
  const roleSelect = document.getElementById('user-modal-role');
  const statusInput = document.getElementById('user-modal-status');
  const statusLabel = modal.querySelector('.toggle__label-text');

  const row = document.querySelector(`tr[data-user-id="${userId}"]`);
  if (row) {
    if (idInput) idInput.value = `#${userId}`;
    if (nameInput) nameInput.value = row.dataset.name || '';
    if (emailInput) emailInput.value = row.dataset.email || '';
    if (passwordInput) passwordInput.value = '';
    if (roleSelect) roleSelect.value = row.dataset.role || '';
    if (statusInput) statusInput.checked = row.dataset.status === 'active';
    if (statusLabel) statusLabel.textContent = row.dataset.status === 'active' ? 'Aktiv' : 'Inaktiv';
  }

  modal.classList.add('modal--open');
  document.body.classList.add('modal-open');
}

function closeUserModal() {
  const modal = document.getElementById('user-edit-modal');
  if (!modal) return;
  modal.classList.remove('modal--open');
  document.body.classList.remove('modal-open');
}

function initUserModal() {
  const closeBtn = document.getElementById('user-modal-close');
  const cancelBtn = document.getElementById('user-modal-cancel');
  const modal = document.getElementById('user-edit-modal');
  const statusInput = document.getElementById('user-modal-status');
  const statusLabel = modal ? modal.querySelector('.toggle__label-text') : null;

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeUserModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeUserModal);

  if (statusInput && statusLabel) {
    statusInput.addEventListener('change', () => {
      statusLabel.textContent = statusInput.checked ? 'Aktiv' : 'Inaktiv';
    });
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('modal')) {
      closeUserModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeUserModal();
    }
  });
}

function openCreateUserModal() {
  const modal = document.getElementById('user-create-modal');
  if (!modal) return;

  const nameInput = document.getElementById('create-user-modal-name');
  const emailInput = document.getElementById('create-user-modal-email');
  const passwordInput = document.getElementById('create-user-modal-password');
  const roleSelect = document.getElementById('create-user-modal-role');
  const statusInput = document.getElementById('create-user-modal-status');
  const statusLabel = document.getElementById('create-user-modal-status-label');

  if (nameInput) nameInput.value = '';
  if (emailInput) emailInput.value = '';
  if (passwordInput) passwordInput.value = '';
  const confirmInput = document.getElementById('create-user-modal-password-confirm');
  if (confirmInput) confirmInput.value = '';
  if (roleSelect) roleSelect.value = 'Admin';
  if (statusInput) statusInput.checked = true;
  if (statusLabel) statusLabel.textContent = 'Aktiv';

  modal.classList.add('modal--open');
  document.body.classList.add('modal-open');
}

function closeCreateUserModal() {
  const modal = document.getElementById('user-create-modal');
  if (!modal) return;
  modal.classList.remove('modal--open');
  document.body.classList.remove('modal-open');
}

function handleCreateUserSubmit() {
  const password = document.getElementById('create-user-modal-password');
  const confirm = document.getElementById('create-user-modal-password-confirm');

  if (password && confirm && password.value !== confirm.value) {
    alert('Adgangskoderne er ikke ens. Tast venligst samme adgangskode i begge felter.');
    confirm.focus();
    return;
  }

  if (password && password.value.length < 1) {
    alert('Adgangskoden må ikke være tom.');
    password.focus();
    return;
  }

  const name = document.getElementById('create-user-modal-name');
  const email = document.getElementById('create-user-modal-email');
  const role = document.getElementById('create-user-modal-role');

  if (name && !name.value.trim()) {
    alert('Navn er et påkrævet felt.');
    name.focus();
    return;
  }

  if (email && !email.value.trim()) {
    alert('E-mail er et påkrævet felt.');
    email.focus();
    return;
  }

  alert(`Bruger oprettet:\nNavn: ${name ? name.value : ''}\nEmail: ${email ? email.value : ''}\nRolle: ${role ? role.value : ''}`);
  closeCreateUserModal();
}

function initCreateUserModal() {
  const closeBtn = document.getElementById('create-user-modal-close');
  const cancelBtn = document.getElementById('create-user-modal-cancel');
  const modal = document.getElementById('user-create-modal');
  const statusInput = document.getElementById('create-user-modal-status');
  const statusLabel = document.getElementById('create-user-modal-status-label');

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeCreateUserModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeCreateUserModal);

  const saveBtn = modal.querySelector('.modal__footer .btn--primary');
  if (saveBtn) saveBtn.addEventListener('click', handleCreateUserSubmit);

  if (statusInput && statusLabel) {
    statusInput.addEventListener('change', () => {
      statusLabel.textContent = statusInput.checked ? 'Aktiv' : 'Inaktiv';
    });
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('modal')) {
      closeCreateUserModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeCreateUserModal();
    }
  });
}

function initAddUserButton() {
  const addBtn = document.getElementById('add-user-btn');
  if (!addBtn) return;
  addBtn.addEventListener('click', openCreateUserModal);
}

function initSagerFilters() {
  const searchInput = document.getElementById('sager-search');
  const statusSelect = document.getElementById('filter-status');
  const tbody = document.getElementById('sager-table-body');
  if (!tbody) return;

  function filterSager() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const status = statusSelect ? statusSelect.value : '';

    const rows = tbody.querySelectorAll('.data-table__row');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('.data-table__cell');
      const id = cells[0] ? cells[0].textContent.toLowerCase() : '';
      const title = cells[1] ? cells[1].textContent.toLowerCase() : '';
      const location = cells[3] ? cells[3].textContent.toLowerCase() : '';
      const assigned = cells[6] ? cells[6].textContent.toLowerCase() : '';
      const rowStatus = row.dataset.status || '';

      const matchesSearch = !query || id.includes(query) || title.includes(query) || location.includes(query) || assigned.includes(query);
      const matchesStatus = !status || rowStatus === status;

      row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterSager);
  if (statusSelect) statusSelect.addEventListener('change', filterSager);
}

function openSagerEditModal(ticketId) {
  const modal = document.getElementById('sager-edit-modal');
  if (!modal) return;

  const idInput = document.getElementById('sager-modal-id');
  const titleInput = document.getElementById('sager-modal-title');
  const typeSelect = document.getElementById('sager-modal-type');
  const descriptionInput = document.getElementById('sager-modal-description');
  const locationInput = document.getElementById('sager-modal-location');
  const statusSelect = document.getElementById('sager-modal-status');
  const prioritySelect = document.getElementById('sager-modal-priority');
  const assignedSelect = document.getElementById('sager-modal-assigned');
  const createdDateInput = document.getElementById('sager-modal-created-date');

  const row = document.querySelector(`tr[data-ticket-id="${ticketId}"]`);
  if (row) {
    if (idInput) idInput.value = `#${ticketId}`;
    if (titleInput) titleInput.value = row.dataset.title || '';
    if (typeSelect) typeSelect.value = row.dataset.type || '';
    if (descriptionInput) descriptionInput.value = row.dataset.description || '';
    if (locationInput) locationInput.value = row.dataset.location || '';
    if (statusSelect) statusSelect.value = row.dataset.status || '';
    if (prioritySelect) prioritySelect.value = row.dataset.priority || '';
    if (assignedSelect) assignedSelect.value = row.dataset.assigned || '';
    if (createdDateInput) createdDateInput.value = row.dataset.createdDate || '';
  }

  modal.setAttribute('data-current-ticket-id', ticketId);
  modal.classList.add('modal--open');
  document.body.classList.add('modal-open');
}

function closeSagerEditModal() {
  const modal = document.getElementById('sager-edit-modal');
  if (!modal) return;
  modal.classList.remove('modal--open');
  modal.removeAttribute('data-current-ticket-id');
  document.body.classList.remove('modal-open');
}

function initSagerEditModal() {
  const closeBtn = document.getElementById('sager-modal-close');
  const cancelBtn = document.getElementById('sager-modal-cancel');
  const modal = document.getElementById('sager-edit-modal');
  const tbody = document.getElementById('sager-table-body');

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeSagerEditModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeSagerEditModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('modal')) {
      closeSagerEditModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeSagerEditModal();
    }
  });

  if (tbody) {
    tbody.addEventListener('click', (event) => {
      const btn = event.target.closest('.sager-edit-btn');
      if (!btn) return;

      const row = btn.closest('.data-table__row');
      if (!row) return;

      const id = row.getAttribute('data-ticket-id');
      openSagerEditModal(id);
    });
  }
}

function openSagerDeleteModal(row) {
  const modal = document.getElementById('sager-delete-modal');
  const message = document.getElementById('sager-delete-modal-message');
  if (!modal) return;

  const titleCell = row.querySelectorAll('.data-table__cell')[1];
  const title = titleCell ? titleCell.textContent : 'denne sag';

  if (message) message.textContent = `Er du sikker på, at du vil slette "${title}"? Denne handling kan ikke fortrydes.`;

  modal.setAttribute('data-delete-ticket-id', row.dataset.ticketId);
  modal.classList.add('modal--open');
  document.body.classList.add('modal-open');
}

function closeSagerDeleteModal() {
  const modal = document.getElementById('sager-delete-modal');
  if (!modal) return;
  modal.classList.remove('modal--open');
  modal.removeAttribute('data-delete-ticket-id');
  document.body.classList.remove('modal-open');
}

function confirmSagerDelete() {
  const modal = document.getElementById('sager-delete-modal');
  if (!modal) return;

  const ticketId = modal.getAttribute('data-delete-ticket-id');
  const row = document.querySelector(`tr[data-ticket-id="${ticketId}"]`);
  if (row) row.remove();

  closeSagerDeleteModal();
}

function initSagerDeleteModal() {
  const closeBtn = document.getElementById('sager-delete-modal-close');
  const cancelBtn = document.getElementById('sager-delete-modal-cancel');
  const confirmBtn = document.getElementById('sager-delete-modal-confirm');
  const modal = document.getElementById('sager-delete-modal');
  const tbody = document.getElementById('sager-table-body');

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeSagerDeleteModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeSagerDeleteModal);
  if (confirmBtn) confirmBtn.addEventListener('click', confirmSagerDelete);

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('modal')) {
      closeSagerDeleteModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeSagerDeleteModal();
    }
  });

  if (tbody) {
    tbody.addEventListener('click', (event) => {
      const btn = event.target.closest('.sager-delete-btn');
      if (!btn) return;

      const row = btn.closest('.data-table__row');
      if (!row) return;

      openSagerDeleteModal(row);
    });
  }
}

function openCreateSagModal() {
  const modal = document.getElementById('sager-create-modal');
  if (!modal) return;

  const titleInput = document.getElementById('sager-create-title');
  const typeSelect = document.getElementById('sager-create-type');
  const descriptionInput = document.getElementById('sager-create-description');
  const locationInput = document.getElementById('sager-create-location');
  const statusSelect = document.getElementById('sager-create-status');
  const prioritySelect = document.getElementById('sager-create-priority');
  const assignedSelect = document.getElementById('sager-create-assigned');
  const dateInput = document.getElementById('sager-create-date');

  if (titleInput) titleInput.value = '';
  if (typeSelect) typeSelect.value = '';
  if (descriptionInput) descriptionInput.value = '';
  if (locationInput) locationInput.value = '';
  if (statusSelect) statusSelect.value = 'not-started';
  if (prioritySelect) prioritySelect.value = 'medium';
  if (assignedSelect) assignedSelect.value = '';
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  modal.classList.add('modal--open');
  document.body.classList.add('modal-open');
}

function closeCreateSagModal() {
  const modal = document.getElementById('sager-create-modal');
  if (!modal) return;
  modal.classList.remove('modal--open');
  document.body.classList.remove('modal-open');
}

function handleCreateSagSubmit() {
  const title = document.getElementById('sager-create-title');
  const type = document.getElementById('sager-create-type');

  if (title && !title.value.trim()) {
    alert('Titel er et påkrævet felt.');
    title.focus();
    return;
  }

  if (type && !type.value.trim()) {
    alert('Type er et påkrævet felt.');
    type.focus();
    return;
  }

  const location = document.getElementById('sager-create-location');
  const status = document.getElementById('sager-create-status');
  const priority = document.getElementById('sager-create-priority');
  const assigned = document.getElementById('sager-create-assigned');

  alert(`Sag oprettet:\nTitel: ${title ? title.value : ''}\nType: ${type ? type.value : ''}\nLokation: ${location ? location.value : ''}\nStatus: ${status ? status.options[status.selectedIndex].text : ''}\nPrioritet: ${priority ? priority.options[priority.selectedIndex].text : ''}\nTildelt: ${assigned ? assigned.options[assigned.selectedIndex].text : ''}`);
  closeCreateSagModal();
}

function initCreateSagModal() {
  const closeBtn = document.getElementById('sager-create-modal-close');
  const cancelBtn = document.getElementById('sager-create-modal-cancel');
  const modal = document.getElementById('sager-create-modal');

  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeCreateSagModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeCreateSagModal);

  const saveBtn = document.getElementById('sager-create-modal-save');
  if (saveBtn) saveBtn.addEventListener('click', handleCreateSagSubmit);

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('modal')) {
      closeCreateSagModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeCreateSagModal();
    }
  });
}

function initAddSagButton() {
  const addBtn = document.getElementById('add-sag-btn');
  if (!addBtn) return;
  addBtn.addEventListener('click', openCreateSagModal);
}

function init() {
  initTableRows();
  initMobileNav();
  initModal();
  initCreateDate();
  initUserFilters();
  initUserActions();
  initUserModal();
  initCreateUserModal();
  initDeleteUserModal();
  initAddUserButton();
  initSagerFilters();
  initSagerEditModal();
  initSagerDeleteModal();
  initCreateSagModal();
  initAddSagButton();
}

init();
