import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HallucinationBadge } from '../components/ui/HallucinationBadge'

describe('HallucinationBadge', () => {
  it('renders nothing when hallucination is false', () => {
    const { container } = render(<HallucinationBadge hallucination={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders a badge when hallucination is true', () => {
    render(<HallucinationBadge hallucination={true} />)
    expect(screen.getByText(/hallucination/i)).toBeInTheDocument()
  })

  it('shows the detail text when provided', () => {
    render(<HallucinationBadge hallucination={true} detail="Art. 999 MAR n'existe pas." />)
    expect(screen.getByText(/Art\. 999 MAR/)).toBeInTheDocument()
  })

  it('applies the hallucination css class', () => {
    const { container } = render(<HallucinationBadge hallucination={true} />)
    expect(container.querySelector('.hallu-badge')).toBeInTheDocument()
  })
})
