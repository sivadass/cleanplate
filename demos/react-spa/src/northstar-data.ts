import type { MenuListItem } from 'cleanplate'
import type { Option } from 'cleanplate'

export type ProjectStatus = 'on-track' | 'at-risk' | 'blocked' | 'done'

export interface Project {
  id: string
  name: string
  owner: string
  team: string
  status: ProjectStatus
  due: string
  progress: number
}

export interface ActivityItem {
  id: string
  author: string
  title: string
  description: string
  meta: string
}

export const NAV_ITEMS: MenuListItem[] = [
  { label: 'Overview', value: 'overview', icon: 'speed' },
  { label: 'Projects', value: 'projects', icon: 'receipt_long' },
  { label: 'Activity', value: 'activity', icon: 'forum' },
  { label: 'Settings', value: 'settings', icon: 'settings' },
]

export const ACCOUNT_MENU_ITEMS: MenuListItem[] = [
  { label: 'Profile', value: 'profile', icon: 'account_circle' },
  { label: 'Preferences', value: 'settings', icon: 'tune' },
  { label: 'Sign out', value: 'logout', icon: 'logout' },
]

export const TEAM_OPTIONS: Option[] = [
  { value: 'design', label: 'Design' },
  { value: 'platform', label: 'Platform' },
  { value: 'growth', label: 'Growth' },
  { value: 'research', label: 'Research' },
]

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'atlas',
    name: 'Atlas checkout',
    owner: 'Maya Chen',
    team: 'Growth',
    status: 'on-track',
    due: '24 Aug',
    progress: 72,
  },
  {
    id: 'lumen',
    name: 'Lumen design system',
    owner: 'Omar Diallo',
    team: 'Design',
    status: 'at-risk',
    due: '02 Sep',
    progress: 41,
  },
  {
    id: 'harbor',
    name: 'Harbor data pipeline',
    owner: 'Priya Shah',
    team: 'Platform',
    status: 'blocked',
    due: '18 Aug',
    progress: 28,
  },
  {
    id: 'nimbus',
    name: 'Nimbus onboarding',
    owner: 'Leo Park',
    team: 'Research',
    status: 'done',
    due: '11 Aug',
    progress: 100,
  },
  {
    id: 'cedar',
    name: 'Cedar billing',
    owner: 'Maya Chen',
    team: 'Growth',
    status: 'on-track',
    due: '30 Aug',
    progress: 55,
  },
]

export const ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    author: 'Omar Diallo',
    title: 'Posted a review on Lumen',
    description: 'Token audit is ready. Two contrast issues left on the empty state.',
    meta: '12m ago',
  },
  {
    id: 'a2',
    author: 'Priya Shah',
    title: 'Blocked Harbor on credentials',
    description: 'Waiting on warehouse access from infra before the backfill can run.',
    meta: '1h ago',
  },
  {
    id: 'a3',
    author: 'Leo Park',
    title: 'Closed Nimbus onboarding',
    description: 'Activation rate is up 9% week over week after the checklist change.',
    meta: 'Yesterday',
  },
]

export const FAQ_ITEMS = [
  {
    title: 'How are project statuses set?',
    content:
      'Owners update status from the project drawer. At-risk means the due date is inside two weeks with progress under 50%. Blocked needs an explicit blocker note.',
  },
  {
    title: 'Who can archive a project?',
    content:
      'Workspace admins and the project owner. Archiving hides the row from the active list but keeps activity history.',
  },
  {
    title: 'Where do notifications go?',
    content:
      'In-app toasts for actions you take, and digest email if you enable it under Workspace settings.',
  },
]

export const STATUS_BADGE: Record<
  ProjectStatus,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' }
> = {
  'on-track': { label: 'On track', variant: 'success' },
  'at-risk': { label: 'At risk', variant: 'warning' },
  blocked: { label: 'Blocked', variant: 'error' },
  done: { label: 'Done', variant: 'info' },
}
