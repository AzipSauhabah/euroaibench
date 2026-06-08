import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreBar } from '../components/ui/ScoreBar'

describe('ScoreBar', () => {
  it('renders score value', () => {
    render(<ScoreBar score={7.5} />)
    expect(screen.getByText('7.5')).toBeInTheDocument()
  })

  it('renders — for null score', () => {
    render(<ScoreBar score={null} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders — for undefined score', () => {
    render(<ScoreBar score={undefined} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders bar fill element', () => {
    const { container } = render(<ScoreBar score={8.0} />)
    expect(container.querySelector('.score-bar-fill')).toBeInTheDocument()
  })

  it('does not show label when showLabel=false', () => {
    render(<ScoreBar score={7.5} showLabel={false} />)
    expect(screen.queryByText('7.5')).not.toBeInTheDocument()
  })

  it('score bar fill width is proportional to score', () => {
    const { container } = render(<ScoreBar score={5.0} />)
    const fill = container.querySelector('.score-bar-fill') as HTMLElement
    expect(fill.style.width).toBe('50%')
  })
})
