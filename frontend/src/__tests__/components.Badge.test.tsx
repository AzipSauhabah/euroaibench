import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../components/ui/Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge type="amf">AMF</Badge>)
    expect(screen.getByText('AMF')).toBeInTheDocument()
  })

  it('applies correct class for AMF', () => {
    const { container } = render(<Badge type="amf">AMF</Badge>)
    expect(container.firstChild).toHaveClass('badge-amf')
  })

  it('applies correct class for mifid2', () => {
    const { container } = render(<Badge type="mifid2">MiFID II</Badge>)
    expect(container.firstChild).toHaveClass('badge-mifid2')
  })

  it('applies correct class for DORA', () => {
    const { container } = render(<Badge type="dora">DORA</Badge>)
    expect(container.firstChild).toHaveClass('badge-dora')
  })

  it('applies base badge class always', () => {
    const { container } = render(<Badge type="easy">Easy</Badge>)
    expect(container.firstChild).toHaveClass('badge')
  })
})
