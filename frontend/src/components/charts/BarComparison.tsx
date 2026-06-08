import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { BenchmarkRun } from '../../types'
import { scoreColor } from '../../utils/scores'

interface Props { runs: BenchmarkRun[] }

export function BarComparison({ runs }: Props) {
  const data = [...runs]
    .sort((a, b) => (b.avg_score ?? 0) - (a.avg_score ?? 0))
    .slice(0, 8)
    .map(r => ({ name: r.model_name.split(':')[0], full: r.model_name, score: r.avg_score ?? 0 }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fill: 'var(--text-3)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 3, fontFamily: 'DM Mono', fontSize: 11 }}
          labelStyle={{ color: 'var(--gold)' }}
          formatter={(val: number, _: string, props: { payload?: { full?: string } }) => [`${val.toFixed(1)}/10`, props.payload?.full ?? '']}
        />
        <Bar dataKey="score" radius={[2, 2, 0, 0]} maxBarSize={40}>
          {data.map((d, i) => <Cell key={i} fill={scoreColor(d.score)} fillOpacity={0.8} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
