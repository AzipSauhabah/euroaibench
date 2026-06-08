import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '../components/ui/EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No data yet" />)
    expect(screen.getByText('No data yet')).toBeInTheDocument()
  })

  it('renders sub text when provided', () => {
    render(<EmptyState title="No data" sub="Run a benchmark first" />)
    expect(screen.getByText('Run a benchmark first')).toBeInTheDocument()
  })

  it('renders custom icon', () => {
    render(<EmptyState icon="🎯" title="Test" />)
    expect(screen.getByText('🎯')).toBeInTheDocument()
  })

  it('renders action when provided', () => {
    render(<EmptyState title="Test" action={<button>Click me</button>} />)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('does not render sub when not provided', () => {
    render(<EmptyState title="Test" />)
    expect(screen.queryByText('Run a benchmark first')).not.toBeInTheDocument()
  })
})
