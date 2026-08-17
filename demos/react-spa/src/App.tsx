import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import {
  Accordion,
  Alert,
  Animated,
  AppShell,
  Avatar,
  Badge,
  BottomSheet,
  BreadCrumb,
  Button,
  ConfirmDialog,
  Container,
  Drawer,
  Dropdown,
  FeedbackState,
  FormControls,
  Icon,
  MediaObject,
  MenuList,
  Modal,
  PageHeader,
  Pagination,
  Pills,
  ProgressBar,
  Spinner,
  Statistic,
  Stepper,
  Table,
  Toast,
  Typography,
} from 'cleanplate'
import type {
  CheckboxValue,
  MenuListItem,
  Option,
  TableColumn,
  TableRow,
  ToastRefHandle,
} from 'cleanplate'
import {
  ACCOUNT_MENU_ITEMS,
  ACTIVITY,
  FAQ_ITEMS,
  INITIAL_PROJECTS,
  NAV_ITEMS,
  STATUS_BADGE,
  TEAM_OPTIONS,
  type Project,
  type ProjectStatus,
} from './northstar-data.ts'

const CURRENT_USER = {
  name: 'Maya Chen',
  email: 'maya@northstar.dev',
}

const ROWS_PER_PAGE_OPTIONS = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
]

const accountMetaStyle = {
  padding: 'var(--space-2) var(--space-4) var(--space-3) var(--space-4)',
  marginBottom: 'var(--space-2)',
  borderBottom: '1px solid var(--gray-100)',
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function AccountMenuContent({
  onClose,
  onSelect,
}: {
  onClose?: () => void
  onSelect: (item: MenuListItem) => void
}) {
  return (
    <>
      <div style={accountMetaStyle}>
        <Typography variant="small" margin="0" style={{ color: 'var(--text-muted)' }}>
          Signed in as
        </Typography>
        <Typography variant="p" margin="t-2" isBold style={{ color: 'var(--text-default)' }}>
          {CURRENT_USER.name}
        </Typography>
        <Typography
          variant="small"
          margin="t-2"
          wordBreak="wrap"
          style={{ color: 'var(--text-subtle)' }}
        >
          {CURRENT_USER.email}
        </Typography>
      </div>
      <MenuList
        items={ACCOUNT_MENU_ITEMS}
        direction="vertical"
        variant="light"
        size="small"
        margin="0"
        onMenuClick={(item: MenuListItem) => {
          onSelect(item)
          onClose?.()
        }}
      />
    </>
  )
}

function ExportMenuContent({
  onClose,
  onExport,
}: {
  onClose?: () => void
  onExport: (format: string) => void
}) {
  return (
    <MenuList
      items={[
        { label: 'Export CSV', value: 'csv', icon: 'download' },
        { label: 'Export PDF', value: 'pdf', icon: 'picture_as_pdf' },
      ]}
      direction="vertical"
      variant="light"
      size="small"
      margin="0"
      onMenuClick={(item: MenuListItem) => {
        onExport(item.value)
        onClose?.()
      }}
    />
  )
}

function statusBadge(status: ProjectStatus) {
  const config = STATUS_BADGE[status]
  return <Badge label={config.label} variant={config.variant} />
}

function App() {
  const toastRef = useRef<ToastRefHandle>(null)
  const [activeNav, setActiveNav] = useState('overview')
  const [pageTab, setPageTab] = useState('active')
  const [search, setSearch] = useState('')
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [tags, setTags] = useState(['Q3', 'launch'])
  const [tagDraft, setTagDraft] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [activityPage, setActivityPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showTrialAlert, setShowTrialAlert] = useState(true)
  const [setupStep, setSetupStep] = useState('invite')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [newName, setNewName] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [newTeam, setNewTeam] = useState<Option | null>(TEAM_OPTIONS[0])
  const [newDue, setNewDue] = useState<Date | null>(new Date(2026, 8, 12))
  const [newColor, setNewColor] = useState<string | null>('#2563eb')
  const [newPriority, setNewPriority] = useState('medium')
  const [newVisibility, setNewVisibility] = useState('team')
  const [newChannels, setNewChannels] = useState<CheckboxValue[]>(['slack'])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newSeats, setNewSeats] = useState('8')
  const [newPrivateNotes, setNewPrivateNotes] = useState(false)

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const [digestEmail, setDigestEmail] = useState(true)
  const [density, setDensity] = useState('comfortable')
  const [brandColor, setBrandColor] = useState<string | null>('#0f766e')
  const [renewalDate, setRenewalDate] = useState<Date | null>(new Date(2026, 11, 1))
  const [defaultVisibility, setDefaultVisibility] = useState('team')
  const [emailTopics, setEmailTopics] = useState<CheckboxValue[]>(['product'])
  const [seatCap, setSeatCap] = useState('25')

  const notify = (mode: 'success' | 'info' | 'warning' | 'error', message: string) => {
    toastRef.current?.addMessage({ mode, message })
  }

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesQuery =
        query.length === 0 ||
        project.name.toLowerCase().includes(query) ||
        project.owner.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      const matchesTab =
        pageTab === 'active' ? project.status !== 'done' : project.status === 'done'
      return matchesQuery && matchesStatus && matchesTab
    })
  }, [pageTab, projects, search, statusFilter])

  const pageRows = filteredProjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const openProject = (row: TableRow) => {
    const project = row as unknown as Project
    setSelectedProject(project)
    setIsDrawerOpen(true)
  }

  const resetCreateForm = () => {
    setWizardStep(0)
    setNewName('')
    setNewSummary('')
    setNewTeam(TEAM_OPTIONS[0])
    setNewDue(new Date(2026, 8, 12))
    setNewColor('#2563eb')
    setNewPriority('medium')
    setNewVisibility('team')
    setNewChannels(['slack'])
    setNewFiles([])
    setNewSeats('8')
    setNewPrivateNotes(false)
  }

  const handleCreateProject = () => {
    if (!newName.trim()) {
      notify('error', 'Give the project a name before creating it.')
      setWizardStep(0)
      return
    }

    const project: Project = {
      id: newName.trim().toLowerCase().replace(/\s+/g, '-'),
      name: newName.trim(),
      owner: CURRENT_USER.name,
      team: typeof newTeam?.label === 'string' ? newTeam.label : 'Design',
      status: 'on-track',
      due: newDue
        ? newDue.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        : 'TBD',
      progress: 8,
    }
    setProjects((current) => [project, ...current])
    setIsCreateOpen(false)
    resetCreateForm()
    notify('success', `${project.name} is on the board.`)
  }

  const handleArchive = () => {
    if (!selectedProject) return
    setProjects((current) => current.filter((project) => project.id !== selectedProject.id))
    setIsDrawerOpen(false)
    setSelectedProject(null)
    notify('warning', `${selectedProject.name} was archived.`)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.setTimeout(() => {
      setIsRefreshing(false)
      notify('info', 'Projects are up to date.')
    }, 900)
  }

  const columns: TableColumn[] = [
    {
      id: 'name',
      title: 'Project',
      customRender: (row) => {
        const project = row as unknown as Project
        return (
          <Typography variant="p" margin="0" isBold>
            {project.name}
          </Typography>
        )
      },
    },
    {
      id: 'owner',
      title: 'Owner',
      customRender: (row) => {
        const project = row as unknown as Project
        return (
          <Container display="flex" align="center" gap="2" padding="0" margin="0">
            <Avatar name={project.owner} size="small" />
            <Typography variant="small" margin="0">
              {project.owner}
            </Typography>
          </Container>
        )
      },
    },
    { id: 'team', title: 'Team' },
    {
      id: 'status',
      title: 'Status',
      customRender: (row) => statusBadge((row as unknown as Project).status),
    },
    { id: 'due', title: 'Due' },
  ]

  const wizardConfig = [
    { label: 'Details', key: 'details', isCompleted: wizardStep > 0, isActive: wizardStep === 0 },
    { label: 'Access', key: 'access', isCompleted: wizardStep > 1, isActive: wizardStep === 1 },
    { label: 'Review', key: 'review', isCompleted: false, isActive: wizardStep === 2 },
  ]

  const setupConfig = [
    { label: 'Profile', key: 'profile', isCompleted: true },
    { label: 'Invite team', key: 'invite', isActive: setupStep === 'invite', isCompleted: setupStep === 'billing' },
    { label: 'Billing', key: 'billing', isActive: setupStep === 'billing' },
  ]

  return (
    <>
      <AppShell
        sidebarWidth="240px"
        sidebar={{
          items: NAV_ITEMS,
          activeItem: activeNav,
          variant: 'light',
          onMenuClick: (item: MenuListItem) => {
            setActiveNav(item.value)
            scrollToSection(item.value)
          },
        }}
        header={{
          menuItems: NAV_ITEMS,
          showCenterMenu: false,
          activeMenuItem: activeNav,
          onMenuItemClick: (item: MenuListItem) => {
            setActiveNav(item.value)
            scrollToSection(item.value)
          },
          headerLeft: (
            <Container display="flex" align="center" gap="2" padding="0" margin="0">
              <Icon name="hub" color="blue" />
              <Typography variant="p" margin="0" isBold>
                Northstar
              </Typography>
            </Container>
          ),
          headerRight: (
            <Dropdown
              placement="bottom-end"
              offset={8}
              trigger={<Avatar name={CURRENT_USER.name} size="medium" margin="0" tabIndex={0} />}
              content={
                <AccountMenuContent
                  onSelect={(item) => {
                    if (item.value === 'settings') {
                      setActiveNav('settings')
                      scrollToSection('settings')
                    }
                    notify('info', `${item.label} — demo only.`)
                  }}
                />
              }
            />
          ),
        }}
        footer={{
          brandName: 'Northstar',
          poweredByLabel: 'Powered by CleanPlate',
          poweredByLink: 'https://cleanplate.sivadass.in',
          children: (
            <Container display="flex" gap="4" padding="0" margin="b-2">
              <Typography variant="small" margin="0">
                Privacy
              </Typography>
              <Typography variant="small" margin="0">
                Status
              </Typography>
              <Typography variant="small" margin="0">
                Changelog
              </Typography>
            </Container>
          ),
        }}
      >
        <Container padding="4" id="overview">
          <BreadCrumb
            margin="b-2"
            items={[
              { label: 'Northstar', href: '#overview' },
              { label: 'Workspace' },
            ]}
          />

          <PageHeader
            title="Workspace overview"
            subtitle="Track shipping work, people, and the next launch from one place."
            primaryCta={
              <Button variant="solid" onClick={() => setIsCreateOpen(true)}>
                New project
              </Button>
            }
            moreMenuItems={[
              { label: 'Refresh', onClick: handleRefresh },
              { label: 'Open filters', onClick: () => setIsFiltersOpen(true) },
              {
                label: 'View archived',
                onClick: () => {
                  setPageTab('done')
                  scrollToSection('projects')
                },
              },
            ]}
          />

          {showTrialAlert ? (
            <Alert
              variant="warning"
              canDismiss
              margin="b-4"
              message="Your Northstar trial ends in 6 days. Add billing to keep projects and activity history."
              onDismiss={() => setShowTrialAlert(false)}
            />
          ) : null}

          <Animated animationType="fade-in-bottom" isBlock margin="b-4">
            <Container display="flex" gap="2" padding="0" margin="0">
              <Container width="quarter" padding="0" margin="0">
                <Statistic
                  variant="card"
                  title="Active projects"
                  value={projects.filter((project) => project.status !== 'done').length}
                  icon={<Icon name="receipt_long" />}
                  description="Excludes archived work"
                  footer={{ label: 'This quarter', badge: 'Live', badgeVariant: 'success' }}
                />
              </Container>
              <Container width="quarter" padding="0" margin="0">
                <Statistic
                  variant="card"
                  tone="warning"
                  title="At risk"
                  value={projects.filter((project) => project.status === 'at-risk').length}
                  icon={<Icon name="error" />}
                  description="Needs a date or owner change"
                />
              </Container>
              <Container width="quarter" padding="0" margin="0">
                <Statistic
                  variant="card"
                  tone="success"
                  title="Shipped"
                  value={projects.filter((project) => project.status === 'done').length}
                  icon={<Icon name="check_circle" />}
                  description="Closed in the last 30 days"
                />
              </Container>
              <Container width="quarter" padding="0" margin="0">
                <Statistic
                  variant="card"
                  title="Storage"
                  value={68}
                  suffix="%"
                  icon={<Icon name="cloud" />}
                  progress={{ value: 68, variant: 'primary' }}
                  description="1.4 GB of 2 GB used"
                />
              </Container>
            </Container>
          </Animated>

          <Container margin="b-4" padding="0">
            <Typography variant="h6" margin="b-2">
              Workspace setup
            </Typography>
            <Stepper
              variant="horizontal"
              config={setupConfig}
              onClick={(step: { key: string; label: string }) => {
                setSetupStep(step.key)
                notify('info', `Setup step: ${step.label}`)
              }}
            />
          </Container>

          <Container id="projects" margin="b-4" padding="0">
            <Container
              display="flex"
              align="center"
              justify="space-between"
              margin="b-2"
              padding="0"
            >
              <Typography variant="h5" margin="0">
                Projects
              </Typography>
              <Container display="flex" gap="2" padding="0" margin="0">
                <Button variant="outline" size="small" onClick={() => setIsFiltersOpen(true)}>
                  Filters
                </Button>
                <Dropdown
                  placement="bottom-end"
                  trigger={<Button variant="ghost" size="small">Export</Button>}
                  content={<ExportMenuContent onExport={(format) => notify('success', `Exported as ${format.toUpperCase()}.`)} />}
                />
                {isRefreshing ? <Spinner size="small" /> : null}
              </Container>
            </Container>

            <MenuList
              items={[
                { label: 'Active', value: 'active' },
                { label: 'Done', value: 'done' },
              ]}
              direction="horizontal"
              variant="light"
              activeItem={pageTab}
              margin="b-2"
              onMenuClick={(item: MenuListItem) => {
                setPageTab(item.value)
                setCurrentPage(1)
              }}
            />

            <FormControls.Input
              type="search"
              label="Search projects"
              placeholder="Name or owner"
              value={search}
              isFluid
              margin="b-2"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setSearch(event.target.value)
                setCurrentPage(1)
              }}
            />

            <Container display="flex" gap="2" align="center" margin="b-2" padding="0">
              {tags.map((tag) => (
                <Pills
                  key={tag}
                  label={tag}
                  mode="remove"
                  onRemove={() => setTags((current) => current.filter((item) => item !== tag))}
                />
              ))}
              <Pills
                mode="edit"
                placeholder="Add tag"
                label={tagDraft}
                onSubmit={(value: string) => {
                  const next = value.trim()
                  if (!next || tags.includes(next)) return
                  setTags((current) => [...current, next])
                  setTagDraft('')
                }}
              />
            </Container>

            {isRefreshing ? (
              <Container display="flex" align="center" gap="2" padding="4" margin="0">
                <Spinner />
                <Typography variant="p" margin="0">
                  Refreshing projects…
                </Typography>
              </Container>
            ) : filteredProjects.length === 0 ? (
              <FeedbackState
                variant="empty"
                title="No projects match"
                description="Clear search or filters to see the full workspace list."
                icon="search_off"
                size="small"
                primaryAction={{
                  label: 'Clear filters',
                  onClick: () => {
                    setSearch('')
                    setStatusFilter('all')
                    setPageTab('active')
                  },
                }}
              />
            ) : (
              <>
                <Table
                  columns={columns}
                  data={pageRows as unknown as TableRow[]}
                  hidePagination
                  padding="0"
                  onRowClick={openProject}
                  mobileColumns={{
                    title: 'name',
                    subtitle: 'owner',
                    description: 'team',
                    meta: 'due',
                  }}
                />
                <Pagination
                  totalItems={filteredProjects.length}
                  totalLabel="Projects"
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                  onPageChange={(page: number, nextRows: number) => {
                    setCurrentPage(page)
                    setRowsPerPage(nextRows)
                  }}
                  onRowsPerPageChange={(nextRows: number) => {
                    setRowsPerPage(nextRows)
                    setCurrentPage(1)
                  }}
                  margin="t-2"
                />
              </>
            )}
          </Container>

          <Container id="activity" margin="b-4" padding="0">
            <Typography variant="h5" margin="b-2">
              Activity
            </Typography>
            {ACTIVITY.slice((activityPage - 1) * 2, activityPage * 2).map((item) => (
              <MediaObject
                key={item.id}
                mediaAvatar={item.author}
                title={item.author}
                subtitle={item.title}
                description={item.description}
                meta={item.meta}
                action={<Icon name="chevron_right" />}
                padding="2"
                margin="b-2"
              />
            ))}
            <Pagination
              variant="minimal"
              totalItems={ACTIVITY.length}
              totalLabel="Updates"
              currentPage={activityPage}
              rowsPerPage={2}
              onPageChange={(page: number) => setActivityPage(page)}
              margin="t-2"
            />
          </Container>

          <Container id="settings" margin="b-4" padding="0">
            <Typography variant="h5" margin="b-2">
              Workspace settings
            </Typography>
            <Typography variant="p" margin="b-4">
              Defaults for new projects. Changes stay in this browser session.
            </Typography>
            <FormControls.Toggle
              label="Send a weekly digest email"
              checked={digestEmail}
              onChange={setDigestEmail}
            />
            <FormControls.SegmentedControl
              label="Table density"
              name="density"
              value={density}
              onChange={(value: string | number) => setDensity(String(value))}
              options={[
                { label: 'Comfortable', value: 'comfortable' },
                { label: 'Compact', value: 'compact' },
              ]}
            />
            <FormControls.ColorPicker
              label="Brand color"
              value={brandColor}
              onChange={setBrandColor}
            />
            <FormControls.Date
              label="Plan renewal"
              value={renewalDate}
              onChange={setRenewalDate}
            />
            <FormControls.Radio
              label="Default visibility"
              name="default-visibility"
              value={defaultVisibility}
              onChange={(value: string | number) => setDefaultVisibility(String(value))}
              options={[
                { label: 'Team', value: 'team', description: 'Everyone in the workspace' },
                { label: 'Invite only', value: 'invite' },
              ]}
            />
            <FormControls.Checkbox
              label="Email me about"
              name="email-topics"
              value={emailTopics}
              onChange={setEmailTopics}
              options={[
                { label: 'Product updates', value: 'product' },
                { label: 'Incident alerts', value: 'incidents' },
                { label: 'Billing', value: 'billing' },
              ]}
            />
            <FormControls.Stepper
              label="Seat cap"
              value={seatCap}
              min={1}
              max={100}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSeatCap(event.target.value)}
            />
            <Button
              variant="solid"
              onClick={() => notify('success', 'Workspace settings saved.')}
            >
              Save settings
            </Button>
          </Container>

          <Container margin="b-4" padding="0">
            <Typography variant="h5" margin="b-2">
              Workspace storage
            </Typography>
            <ProgressBar value={68} variant="primary" margin="b-2" />
            <Typography variant="small" margin="0">
              Attachments and exports share this quota.
            </Typography>
          </Container>

          <Accordion
            variant="spaced"
            titleTag="h3"
            allowMultiple
            items={FAQ_ITEMS}
          />
        </Container>
      </AppShell>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          resetCreateForm()
        }}
        title="New project"
        size="large"
        primaryButtonLabel={wizardStep === 2 ? 'Create project' : 'Continue'}
        secondaryButtonLabel={wizardStep === 0 ? 'Cancel' : 'Back'}
        onPrimaryButtonClick={() => {
          if (wizardStep < 2) {
            setWizardStep((step) => step + 1)
            return
          }
          handleCreateProject()
        }}
        onSecondaryButtonClick={() => {
          if (wizardStep === 0) {
            setIsCreateOpen(false)
            resetCreateForm()
            return
          }
          setWizardStep((step) => step - 1)
        }}
      >
        <Stepper variant="horizontal" config={wizardConfig} margin="b-4" />
        {wizardStep === 0 ? (
          <>
            <FormControls.Input
              label="Project name"
              placeholder="Harbor analytics"
              value={newName}
              isRequired
              isFluid
              onChange={(event: ChangeEvent<HTMLInputElement>) => setNewName(event.target.value)}
            />
            <FormControls.TextArea
              label="Summary"
              placeholder="What are we shipping?"
              value={newSummary}
              isFluid
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setNewSummary(event.target.value)}
            />
            <FormControls.Select
              label="Team"
              options={TEAM_OPTIONS}
              value={newTeam}
              isFluid
              onChange={(option: Option | Option[] | null) =>
                setNewTeam(Array.isArray(option) ? option[0] : option)
              }
            />
            <FormControls.Date label="Target date" value={newDue} onChange={setNewDue} />
            <FormControls.ColorPicker
              label="Project color"
              value={newColor}
              onChange={setNewColor}
            />
            <FormControls.SegmentedControl
              label="Priority"
              name="priority"
              value={newPriority}
              onChange={(value: string | number) => setNewPriority(String(value))}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ]}
            />
          </>
        ) : null}
        {wizardStep === 1 ? (
          <>
            <FormControls.Radio
              label="Visibility"
              name="visibility"
              value={newVisibility}
              onChange={(value: string | number) => setNewVisibility(String(value))}
              options={[
                { label: 'Team', value: 'team' },
                { label: 'Invite only', value: 'invite' },
              ]}
            />
            <FormControls.Checkbox
              label="Notify via"
              name="channels"
              value={newChannels}
              onChange={setNewChannels}
              options={[
                { label: 'Slack', value: 'slack' },
                { label: 'Email', value: 'email' },
              ]}
            />
            <FormControls.File
              label="Brief"
              name="brief"
              variant="card"
              accept="application/pdf,image/*"
              value={newFiles}
              onChange={setNewFiles}
            />
            <FormControls.Stepper
              label="Contributor seats"
              value={newSeats}
              min={1}
              max={50}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setNewSeats(event.target.value)}
            />
            <FormControls.Toggle
              label="Keep kickoff notes private"
              checked={newPrivateNotes}
              onChange={setNewPrivateNotes}
            />
          </>
        ) : null}
        {wizardStep === 2 ? (
          <Container padding="0" margin="0">
            <Typography variant="p" margin="b-2" isBold>
              {newName || 'Untitled project'}
            </Typography>
            <Typography variant="p" margin="b-2">
              {newSummary || 'No summary yet.'}
            </Typography>
            <Typography variant="small" margin="0">
              {newTeam?.label} · {newPriority} priority · {newSeats} seats
            </Typography>
          </Container>
        ) : null}
      </Modal>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        placement="right"
        size="medium"
        title={selectedProject?.name ?? 'Project'}
        primaryButtonLabel="Archive"
        secondaryButtonLabel="Close"
        onPrimaryButtonClick={() => setIsArchiveOpen(true)}
        onSecondaryButtonClick={() => setIsDrawerOpen(false)}
      >
        {selectedProject ? (
          <>
            {statusBadge(selectedProject.status)}
            <Typography variant="p" margin={['t-3', 'b-2']}>
              Owned by {selectedProject.owner} in {selectedProject.team}. Due {selectedProject.due}.
            </Typography>
            <Typography variant="small" margin="b-2">
              Sprint progress
            </Typography>
            <ProgressBar value={selectedProject.progress} variant="success" margin="b-4" />
            <MediaObject
              mediaAvatar={selectedProject.owner}
              title={selectedProject.owner}
              subtitle="Project owner"
              description="Click archive if this work is no longer active."
              padding="2"
            />
          </>
        ) : null}
      </Drawer>

      <ConfirmDialog
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        variant="destructive"
        title="Archive this project?"
        description="It leaves the active list. Activity history is kept for the workspace."
        primaryButtonLabel="Archive"
        secondaryButtonLabel="Keep it"
        onPrimaryButtonClick={handleArchive}
      />

      <BottomSheet isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)}>
        <Container padding="4">
          <Typography variant="h5" margin="b-3">
            Filter projects
          </Typography>
          <FormControls.Radio
            label="Status"
            name="status-filter"
            value={statusFilter}
            onChange={(value: string | number) => {
              setStatusFilter(String(value))
              setCurrentPage(1)
            }}
            options={[
              { label: 'All', value: 'all' },
              { label: 'On track', value: 'on-track' },
              { label: 'At risk', value: 'at-risk' },
              { label: 'Blocked', value: 'blocked' },
            ]}
          />
          <Button variant="solid" onClick={() => setIsFiltersOpen(false)}>
            Apply filters
          </Button>
        </Container>
      </BottomSheet>

      <Toast ref={toastRef} autoClose autoCloseTime={3200} />
    </>
  )
}

export default App
