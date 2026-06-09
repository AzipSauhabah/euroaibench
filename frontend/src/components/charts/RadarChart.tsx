import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import type { BenchmarkRun, Question } from '../../types'
import { DOMAINS, DOMAIN_SHORT } from '../../types'
import { getDomainScores } from '../../utils/scores'

const COLORS = ['#c9a84c', '#5a7ec2', '#5a9c6e', '#c25a5a', '#9c5ac2', '#4ca89c']

interface Props { runs: BenchmarkRun[]; questions: Question[] }

export function DomainRadar({ runs, questions }: Props) {
  const top = runs.slice(0, 3)
  const qmap = questions.map(q => ({ id: q.id, domain: q.domain }))

  const data = DOMAINS.map(d => {
    const row: Record<string, string | number> = { domain: DOMAIN_SHORT[d] }
    top.forEach(r => {
      const scores = getDomainScores(r, qmap)
      row[r.model_name] = scores[d] ?? 0
    })
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(201,168,76,0.1)" />
        <PolarAngleAxis dataKey="domain" tick={{ fill: 'var(--text-2)', fontSize: 10, fontFamily: 'DM Mono' }} />
        {top.map((r, i) => (
          <Radar key={r.id} name={r.model_name} dataKey={r.model_name}
            stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.08} strokeWidth={1.5} />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}
