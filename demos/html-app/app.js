import 'cleanplate/dist/index.css'
import './demo.css'

const toastIcons = {
  success: 'check_circle',
  info: 'info',
  warning: 'warning',
  error: 'error',
}

const overlayIds = [
  'modal-create',
  'drawer-project',
  'confirm-archive',
  'sheet-filters',
  'header-mobile-menu',
]

const dropdownIds = ['account-menu', 'export-menu', 'more-menu', 'team-select-menu']

let wizardStep = 0
let currentPage = 1
let rowsPerPage = 5
let activityPage = 1
let pageTab = 'active'
let statusFilter = 'all'

function $(id) {
  return document.getElementById(id)
}

function notify(mode, message) {
  const container = $('toast-root')
  const toast = document.createElement('div')
  toast.className = `cp-toast cp-toast--${mode}`
  toast.setAttribute('role', 'button')
  toast.tabIndex = 0
  toast.innerHTML = `<span class="material-symbols-outlined cp-toast__icon">${toastIcons[mode]}</span><div class="cp-toast__message">${message}</div>`
  const dismiss = () => toast.remove()
  toast.addEventListener('click', dismiss)
  container.appendChild(toast)
  window.setTimeout(dismiss, 3200)
}

function setOverlayOpen(open) {
  document.body.classList.toggle('cp-overlay-open', open)
}

function closeDropdowns() {
  dropdownIds.forEach((id) => {
    const node = $(id)
    if (node) node.hidden = true
  })
}

function toggleDropdown(id, event) {
  event?.stopPropagation()
  const node = $(id)
  const wasOpen = !node.hidden
  closeDropdowns()
  node.hidden = wasOpen
}

function syncOverlayLock() {
  const anyOpen = overlayIds.some((id) => {
    const node = $(id)
    return node && !node.hidden
  })
  setOverlayOpen(anyOpen)
}

function openOverlay(id) {
  closeDropdowns()
  const target = $(id)
  if (!target) return
  target.hidden = false
  if (id === 'modal-create') {
    target.querySelector('.cp-modal-overlay')?.classList.add('cp-modal-overlay-open')
  }
  if (id === 'confirm-archive') {
    target.querySelector('.cp-confirm-dialog-overlay')?.classList.add('cp-confirm-dialog-overlay-open')
  }
  syncOverlayLock()
}

function closeOverlay(id) {
  const node = $(id)
  if (!node) return
  node.hidden = true
  node.querySelector('.cp-modal-overlay')?.classList.remove('cp-modal-overlay-open')
  node.querySelector('.cp-confirm-dialog-overlay')?.classList.remove('cp-confirm-dialog-overlay-open')
  syncOverlayLock()
}

function closeOverlays() {
  overlayIds.forEach((id) => closeOverlay(id))
}

function setNav(value) {
  document.querySelectorAll('[data-nav]').forEach((item) => {
    item.classList.toggle('cp-menu-list-item--active', item.dataset.nav === value)
  })
  $(value)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function projectRows() {
  return Array.from(document.querySelectorAll('#project-rows tr'))
}

function matchesFilters(row) {
  const query = $('project-search').value.trim().toLowerCase()
  const status = row.dataset.status
  const name = row.dataset.name.toLowerCase()
  const owner = row.dataset.owner.toLowerCase()
  const matchesQuery = query.length === 0 || name.includes(query) || owner.includes(query)
  const matchesStatus = statusFilter === 'all' || status === statusFilter
  const matchesTab = pageTab === 'active' ? status !== 'done' : status === 'done'
  return matchesQuery && matchesStatus && matchesTab
}

function renderProjects() {
  const rows = projectRows()
  const filtered = rows.filter(matchesFilters)
  const total = filtered.length
  const start = (currentPage - 1) * rowsPerPage
  const pageRows = filtered.slice(start, start + rowsPerPage)

  rows.forEach((row) => {
    row.hidden = true
  })
  pageRows.forEach((row) => {
    row.hidden = false
  })

  const empty = total === 0
  $('projects-table').hidden = empty
  $('projects-pagination').hidden = empty
  $('projects-empty').hidden = !empty
  $('project-total').textContent = `Total Projects: ${total}`

  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage) || 1)
  if (currentPage > totalPages) currentPage = totalPages

  const buttons = $('project-page-buttons')
  buttons.querySelectorAll('[data-page]').forEach((button) => {
    const page = Number(button.dataset.page)
    button.classList.toggle('cp-button--solid', page === currentPage)
    button.classList.toggle('cp-button--outline', page !== currentPage)
  })
}

function renderActivity() {
  const items = Array.from(document.querySelectorAll('[data-activity]'))
  const perPage = 2
  const start = (activityPage - 1) * perPage
  items.forEach((item, index) => {
    item.hidden = index < start || index >= start + perPage
  })
  $('activity-total').textContent = `Total Updates: ${items.length}`
  document.querySelectorAll('[data-activity-page]').forEach((button) => {
    const page = Number(button.dataset.activityPage)
    button.classList.toggle('cp-button--solid', page === activityPage)
    button.classList.toggle('cp-button--outline', page !== activityPage)
  })
}

function setWizardStep(step) {
  wizardStep = step
  document.querySelectorAll('[data-wizard-panel]').forEach((panel) => {
    panel.hidden = Number(panel.dataset.wizardPanel) !== step
  })
  document.querySelectorAll('#wizard-stepper .cp-stepper-item').forEach((item, index) => {
    item.classList.toggle('cp-stepper-item--active', index === step)
    item.classList.toggle('cp-stepper-item--completed', index < step)
    const count = item.querySelector('.cp-stepper-count')
    if (index < step) {
      count.innerHTML = '<span class="cp-icon cp-icon--small cp-stepper-count-icon">done</span>'
    } else {
      count.textContent = String(index + 1)
    }
  })
  $('wizard-primary').textContent = step === 2 ? 'Create project' : 'Continue'
  $('wizard-secondary').textContent = step === 0 ? 'Cancel' : 'Back'
  if (step === 2) {
    $('review-name').textContent = $('new-name').value.trim() || 'Untitled project'
    $('review-summary').textContent = $('new-summary').value.trim() || 'No summary yet.'
    $('review-meta').textContent = `${$('team-value').textContent} · ${document.querySelector('input[name="priority"]:checked')?.value ?? 'medium'} priority · ${$('new-seats').value} seats`
  }
}

function openProject(row) {
  $('drawer-title').textContent = row.dataset.name
  $('drawer-copy').textContent =
    `Owned by ${row.dataset.owner} in ${row.dataset.team}. Due ${row.dataset.due}.`
  $('drawer-owner-name').textContent = row.dataset.owner
  $('drawer-owner-avatar').textContent = initials(row.dataset.owner)
  $('drawer-progress-fill').style.width = `${row.dataset.progress}%`
  const badge = STATUS_BADGE[row.dataset.status]
  $('drawer-badge').className = `cp-badge cp-badge--${badge.variant}`
  $('drawer-badge').textContent = badge.label
  $('drawer-project').dataset.projectId = row.dataset.projectId
  openOverlay('drawer-project')
}

const STATUS_BADGE = {
  'on-track': { label: 'On track', variant: 'success' },
  'at-risk': { label: 'At risk', variant: 'warning' },
  blocked: { label: 'Blocked', variant: 'error' },
  done: { label: 'Done', variant: 'info' },
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function bumpStepper(input, delta) {
  const min = Number(input.min || 0)
  const max = Number(input.max || 100)
  const next = Math.min(max, Math.max(min, Number(input.value || 0) + delta))
  input.value = String(next)
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.cp-dropdown')) closeDropdowns()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDropdowns()
    closeOverlays()
  }
})

document.querySelectorAll('[data-nav] a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    const item = event.currentTarget.closest('[data-nav]')
    setNav(item.dataset.nav)
    closeOverlays()
  })
})

$('open-create')?.addEventListener('click', () => {
  setWizardStep(0)
  openOverlay('modal-create')
})

$('open-filters')?.addEventListener('click', () => openOverlay('sheet-filters'))
$('open-filters-more')?.addEventListener('click', () => {
  closeDropdowns()
  openOverlay('sheet-filters')
})
$('open-account')?.addEventListener('click', (event) => toggleDropdown('account-menu', event))
$('open-export')?.addEventListener('click', (event) => toggleDropdown('export-menu', event))
$('open-more')?.addEventListener('click', (event) => toggleDropdown('more-menu', event))
$('open-team-select')?.addEventListener('click', (event) => toggleDropdown('team-select-menu', event))
$('open-mobile-menu')?.addEventListener('click', () => openOverlay('header-mobile-menu'))

document.querySelectorAll('[data-close-overlay]').forEach((node) => {
  node.addEventListener('click', closeOverlays)
})

document.querySelectorAll('[data-close-id]').forEach((node) => {
  node.addEventListener('click', () => closeOverlay(node.dataset.closeId))
})

$('wizard-secondary')?.addEventListener('click', () => {
  if (wizardStep === 0) {
    closeOverlays()
    return
  }
  setWizardStep(wizardStep - 1)
})

$('wizard-primary')?.addEventListener('click', () => {
  if (wizardStep < 2) {
    setWizardStep(wizardStep + 1)
    return
  }
  const name = $('new-name').value.trim()
  if (!name) {
    notify('error', 'Give the project a name before creating it.')
    setWizardStep(0)
    return
  }
  notify('success', `${name} is on the board.`)
  closeOverlays()
})

document.querySelectorAll('#team-select-menu [data-team]').forEach((option) => {
  option.addEventListener('click', () => {
    $('team-value').textContent = option.dataset.team
    closeDropdowns()
  })
})

document.querySelectorAll('#export-menu [data-export]').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault()
    notify('success', `Exported as ${item.dataset.export.toUpperCase()}.`)
    closeDropdowns()
  })
})

document.querySelectorAll('#account-menu [data-account]').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault()
    if (item.dataset.account === 'settings') setNav('settings')
    const label = item.querySelector('.cp-menu-list-item-label')?.textContent?.trim() ?? item.dataset.account
    notify('info', `${label} — demo only.`)
    closeDropdowns()
  })
})

$('refresh-projects')?.addEventListener('click', () => {
  closeDropdowns()
  $('refresh-spinner').hidden = false
  window.setTimeout(() => {
    $('refresh-spinner').hidden = true
    notify('info', 'Projects are up to date.')
  }, 900)
})

$('view-archived')?.addEventListener('click', () => {
  closeDropdowns()
  pageTab = 'done'
  currentPage = 1
  document.querySelectorAll('[data-tab]').forEach((item) => {
    item.classList.toggle('cp-menu-list-item--active', item.dataset.tab === 'done')
  })
  renderProjects()
  setNav('projects')
})

document.querySelectorAll('[data-tab] a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    pageTab = event.currentTarget.closest('[data-tab]').dataset.tab
    currentPage = 1
    document.querySelectorAll('[data-tab]').forEach((item) => {
      item.classList.toggle('cp-menu-list-item--active', item.dataset.tab === pageTab)
    })
    renderProjects()
  })
})

$('project-search')?.addEventListener('input', () => {
  currentPage = 1
  renderProjects()
})

$('dismiss-alert')?.addEventListener('click', () => {
  $('trial-alert').hidden = true
})

document.querySelectorAll('[data-remove-tag]').forEach((button) => {
  button.addEventListener('click', () => button.closest('.cp-pills').remove())
})

$('add-tag')?.addEventListener('click', () => {
  const input = $('tag-input')
  const value = input.value.trim()
  if (!value) return
  const pill = document.createElement('div')
  pill.className = 'cp-pills'
  pill.setAttribute('data-cp', 'Pills')
  pill.innerHTML = `<div class="cp-pills-wrapper"><p class="cp-typography cp-pills-label">${value}</p><button type="button" class="cp-button cp-button--icon cp-button--medium cp-pills-button" data-remove-tag><span class="cp-icon">close</span></button></div>`
  pill.querySelector('[data-remove-tag]').addEventListener('click', () => pill.remove())
  $('tag-row').insertBefore(pill, $('tag-edit'))
  input.value = ''
})

$('tag-input')?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    $('add-tag').click()
  }
})

document.querySelectorAll('#project-rows tr').forEach((row) => {
  row.addEventListener('click', () => openProject(row))
})

$('clear-filters')?.addEventListener('click', () => {
  $('project-search').value = ''
  statusFilter = 'all'
  pageTab = 'active'
  document.querySelector('input[name="status-filter"][value="all"]').checked = true
  document.querySelectorAll('[data-tab]').forEach((item) => {
    item.classList.toggle('cp-menu-list-item--active', item.dataset.tab === 'active')
  })
  currentPage = 1
  renderProjects()
})

document.querySelectorAll('input[name="status-filter"]').forEach((input) => {
  input.addEventListener('change', () => {
    statusFilter = input.value
    currentPage = 1
    renderProjects()
  })
})

$('apply-filters')?.addEventListener('click', closeOverlays)

$('project-prev')?.addEventListener('click', () => {
  currentPage = Math.max(1, currentPage - 1)
  renderProjects()
})

$('project-next')?.addEventListener('click', () => {
  const total = projectRows().filter(matchesFilters).length
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
  currentPage = Math.min(totalPages, currentPage + 1)
  renderProjects()
})

document.querySelectorAll('#project-page-buttons [data-page]').forEach((button) => {
  button.addEventListener('click', () => {
    currentPage = Number(button.dataset.page)
    renderProjects()
  })
})

$('rows-per-page')?.addEventListener('change', (event) => {
  rowsPerPage = Number(event.target.value)
  currentPage = 1
  renderProjects()
})

$('activity-prev')?.addEventListener('click', () => {
  activityPage = Math.max(1, activityPage - 1)
  renderActivity()
})

$('activity-next')?.addEventListener('click', () => {
  activityPage = Math.min(2, activityPage + 1)
  renderActivity()
})

document.querySelectorAll('[data-activity-page]').forEach((button) => {
  button.addEventListener('click', () => {
    activityPage = Number(button.dataset.activityPage)
    renderActivity()
  })
})

$('archive-open')?.addEventListener('click', () => openOverlay('confirm-archive'))

$('archive-confirm')?.addEventListener('click', () => {
  const id = $('drawer-project').dataset.projectId
  document.querySelector(`#project-rows tr[data-project-id="${id}"]`)?.remove()
  closeOverlays()
  renderProjects()
  notify('warning', `${$('drawer-title').textContent} was archived.`)
})

$('save-settings')?.addEventListener('click', () => notify('success', 'Workspace settings saved.'))

document.querySelectorAll('[data-stepper]').forEach((button) => {
  button.addEventListener('click', () => {
    bumpStepper($(button.dataset.stepper), Number(button.dataset.delta))
  })
})

document.querySelectorAll('.cp-accordion-header').forEach((header) => {
  header.addEventListener('click', () => {
    const content = header.parentElement.querySelector('.cp-accordion-content')
    const open = content.classList.toggle('cp-accordion-content-open')
    header.querySelector('.cp-accordion-icon').textContent = open ? 'expand_less' : 'expand_more'
  })
})

document.querySelectorAll('#setup-stepper .cp-stepper-item').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault()
    notify('info', `Setup step: ${item.querySelector('.cp-stepper-link').textContent}`)
  })
})

$('open-color')?.addEventListener('click', () => $('brand-color').click())
$('brand-color')?.addEventListener('input', (event) => {
  $('color-swatch').style.background = event.target.value
  $('color-value').textContent = event.target.value
})

$('open-date')?.addEventListener('click', () => $('renewal-date').showPicker?.() || $('renewal-date').click())
$('renewal-date')?.addEventListener('change', (event) => {
  const date = new Date(`${event.target.value}T00:00:00`)
  $('date-value').textContent = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  $('date-value').classList.remove('cp-select-placeholder')
})

$('open-project-color')?.addEventListener('click', () => $('project-color').click())
$('project-color')?.addEventListener('input', (event) => {
  $('project-color-swatch').style.background = event.target.value
  $('project-color-value').textContent = event.target.value
})

$('open-project-date')?.addEventListener('click', () => $('project-date').showPicker?.() || $('project-date').click())
$('project-date')?.addEventListener('change', (event) => {
  const date = new Date(`${event.target.value}T00:00:00`)
  $('project-date-value').textContent = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  $('project-date-value').classList.remove('cp-select-placeholder')
})

$('brief-input')?.addEventListener('change', (event) => {
  const files = Array.from(event.target.files ?? [])
  $('brief-list').hidden = files.length === 0
  $('brief-list').innerHTML = files
    .map(
      (file) =>
        `<li class="cp-file-item"><span class="cp-icon">description</span><span>${file.name}</span></li>`,
    )
    .join('')
})

renderProjects()
renderActivity()
setWizardStep(0)
