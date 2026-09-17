import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  BreadCrumb,
  Button,
  Container,
  FormControls,
  PageHeader,
  Typography,
} from 'cleanplate'
import type { CheckboxValue, Option } from 'cleanplate'
import { TEAM_OPTIONS } from './northstar-data.ts'

const URGENCY_OPTIONS = [
  { label: 'This week', value: 'week' },
  { label: 'This month', value: 'month' },
  { label: 'This quarter', value: 'quarter' },
]

const ENGAGEMENT_OPTIONS = [
  { label: 'New project', value: 'new' },
  { label: 'Extension', value: 'extension' },
  { label: 'Spike', value: 'spike' },
]

const STAKEHOLDER_OPTIONS = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'eng' },
  { label: 'Product', value: 'product' },
  { label: 'Legal', value: 'legal' },
]

const DEFAULT_KICKOFF = new Date(2026, 8, 21)

export function IntakePage({
  notify,
}: {
  notify: (mode: 'success' | 'info' | 'warning' | 'error', message: string) => void
}) {
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [problem, setProblem] = useState('')
  const [team, setTeam] = useState<Option | null>(TEAM_OPTIONS[0])
  const [labelColor, setLabelColor] = useState<string | null>('#2563eb')
  const [kickoff, setKickoff] = useState<Date | null>(DEFAULT_KICKOFF)
  const [urgency, setUrgency] = useState('month')
  const [engagement, setEngagement] = useState('new')
  const [stakeholders, setStakeholders] = useState<CheckboxValue[]>(['design', 'eng'])
  const [weeks, setWeeks] = useState('6')
  const [files, setFiles] = useState<File[]>([])
  const [needsSecurityReview, setNeedsSecurityReview] = useState(false)

  const resetForm = () => {
    setTitle('')
    setEmail('')
    setProblem('')
    setTeam(TEAM_OPTIONS[0])
    setLabelColor('#2563eb')
    setKickoff(DEFAULT_KICKOFF)
    setUrgency('month')
    setEngagement('new')
    setStakeholders(['design', 'eng'])
    setWeeks('6')
    setFiles([])
    setNeedsSecurityReview(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextTitle = title.trim()
    if (!nextTitle) {
      notify('error', 'Give the request a title before submitting.')
      return
    }
    notify('success', `${nextTitle} was filed for intake.`)
  }

  return (
    <Container padding="4" id="intake">
      <BreadCrumb
        margin="b-2"
        items={[{ label: 'Northstar', href: '#overview' }, { label: 'Intake' }]}
      />
      <PageHeader
        title="Project intake"
        subtitle="File a request the workspace can staff this quarter. Submit stays in this browser session."
      />
      <form className="intake-form" onSubmit={handleSubmit}>
        <Typography variant="h6" margin="b-2">
          Basics
        </Typography>
        <FormControls.Input
          label="Request title"
          placeholder="Harbor analytics rebuild"
          value={title}
          isRequired
          isFluid
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
        />
        <FormControls.Input
          label="Sponsor email"
          type="email"
          placeholder="maya@northstar.dev"
          autoComplete="email"
          value={email}
          isFluid
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        />
        <FormControls.TextArea
          label="Problem statement"
          placeholder="What is blocked, and what does done look like?"
          value={problem}
          isFluid
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setProblem(event.target.value)}
        />
        <FormControls.Select
          label="Requesting team"
          options={TEAM_OPTIONS}
          value={team}
          isFluid
          onChange={(option: Option | Option[] | null) =>
            setTeam(Array.isArray(option) ? option[0] : option)
          }
        />
        <FormControls.ColorPicker
          label="Label color"
          value={labelColor}
          onChange={setLabelColor}
        />

        <Typography variant="h6" margin={['t-4', 'b-2']}>
          Schedule and people
        </Typography>
        <FormControls.Date label="Kickoff date" value={kickoff} onChange={setKickoff} />
        <FormControls.SegmentedControl
          label="Urgency"
          name="intake-urgency"
          value={urgency}
          onChange={(value: string | number) => setUrgency(String(value))}
          options={URGENCY_OPTIONS}
        />
        <FormControls.Radio
          label="Engagement type"
          name="intake-engagement"
          value={engagement}
          onChange={(value: string | number) => setEngagement(String(value))}
          options={ENGAGEMENT_OPTIONS}
        />
        <FormControls.Checkbox
          label="Stakeholders to loop in"
          name="intake-stakeholders"
          value={stakeholders}
          onChange={setStakeholders}
          options={STAKEHOLDER_OPTIONS}
        />
        <FormControls.Stepper
          label="Estimated weeks"
          value={weeks}
          min={1}
          max={26}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setWeeks(event.target.value)}
        />

        <Typography variant="h6" margin={['t-4', 'b-2']}>
          Delivery
        </Typography>
        <FormControls.File
          label="Attach brief"
          name="intake-brief"
          variant="card"
          accept="application/pdf,image/*"
          value={files}
          onChange={setFiles}
        />
        <FormControls.Toggle
          label="Needs a security review"
          checked={needsSecurityReview}
          onChange={setNeedsSecurityReview}
        />

        <Container display="flex" gap="2" padding="0" margin="t-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              resetForm()
              notify('info', 'Intake form cleared.')
            }}
          >
            Clear
          </Button>
          <Button variant="solid" type="submit">
            Submit intake
          </Button>
        </Container>
      </form>
    </Container>
  )
}
