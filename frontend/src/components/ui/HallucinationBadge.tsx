interface Props {
  hallucination?: boolean
  detail?: string
}

export function HallucinationBadge({ hallucination, detail }: Props) {
  if (!hallucination) return null
  return (
    <span className="hallu-badge" title={detail || 'Hallucination réglementaire détectée'}>
      <span className="hallu-dot" aria-hidden />
      Hallucination
      {detail ? <span className="hallu-detail">{detail}</span> : null}
    </span>
  )
}
