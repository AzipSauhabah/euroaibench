import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import type { BenchmarkRun } from '../../types'
import { hallucinationRate, hallucinationColor } from '../../utils/scores'

interface Props { runs: BenchmarkRun[] }

export function HallucinationScatter({ runs }: Props) {
  const data = runs
    .map(r => {
      const hr = hallucinationRate(r)
      return hr == null ? null : {
        name: r.model_name.split(':')[0],
        full: r.model_name,
        score: r.avg_score ?? 0,
        hallu: +(hr * 100).toFixed(1),
      }
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ScatterChart margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.06)" />
        <XAxis type="number" dataKey="score" name="Score" domain={[0, 10]}
          tick={{ fill: 'var(--text-3)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false}
          label={{ value: 'Score /10', position: 'insideBottom', offset: -2, fill: 'var(--text-3)', fontSize: 9 }} />
        <YAxis type="number" dataKey="hallu" name="Hallucination" unit="%" domain={[0, 'dataMax + 5']}
          tick={{ fill: 'var(--text-3)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
        <ZAxis range={[80, 80]} />
        <ReferenceLine y={15} stroke="var(--red)" strokeDasharray="2 4" strokeOpacity={0.4} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3', stroke: 'var(--border)' }}
          contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 3, fontFamily: 'DM Mono', fontSize: 11 }}
          labelStyle={{ color: 'var(--gold)' }}
          formatter={(val: number, key: string) => key === 'Hallucination' ? [`${val}%`, 'Hallucination'] : [`${val.toFixed(1)}/10`, 'Score']}
        />
        <Scatter data={data}>
          {data.map((d, i) => <Cell key={i} fill={hallucinationColor(d.hallu / 100)} fillOpacity={0.85} />)}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}
