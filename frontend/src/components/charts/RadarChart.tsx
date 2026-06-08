import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import type { BenchmarkRun } from '../../types'
import { getRegScores } from '../../utils/scores'

const MOCK_QUESTIONS = [
  ...Array.from({length:7},(_,i)=>({id:i+1,regulation:'AMF' as const})),
  ...Array.from({length:7},(_,i)=>({id:i+8,regulation:'MIFID2' as const})),
  ...Array.from({length:6},(_,i)=>({id:i+15,regulation:'DORA' as const})),
]

const COLORS = ['#c9a84c','#5a7ec2','#5a9c6e','#c25a5a','#9c5ac2']

interface Props { runs: BenchmarkRun[] }

export function RegulationRadar({ runs }: Props) {
  const top = runs.slice(0, 3)
  const data = [
    { reg: 'AMF' },
    { reg: 'MiFID II' },
    { reg: 'DORA' },
  ].map(d => {
    const row: Record<string, string | number> = { reg: d.reg }
    top.forEach(r => {
      const scores = getRegScores(r, MOCK_QUESTIONS)
      const key = d.reg === 'AMF' ? 'AMF' : d.reg === 'MiFID II' ? 'MIFID2' : 'DORA'
      row[r.model_name] = scores[key as keyof typeof scores] ?? 0
    })
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(201,168,76,0.1)" />
        <PolarAngleAxis dataKey="reg" tick={{ fill: 'var(--text-2)', fontSize: 11, fontFamily: 'DM Mono' }} />
        {top.map((r, i) => (
          <Radar key={r.id} name={r.model_name} dataKey={r.model_name}
            stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.08} strokeWidth={1.5} />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}
