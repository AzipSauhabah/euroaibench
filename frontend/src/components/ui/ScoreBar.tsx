import { scoreColor } from '../../utils/scores'
interface Props { score?: number | null; showLabel?: boolean }
export function ScoreBar({ score, showLabel = true }: Props) {
  const s = score ?? 0
  const col = scoreColor(score)
  return (
    <div className="score-bar-wrap">
      {showLabel && <span className="score-num" style={{ color: col }}>{score != null ? score.toFixed(1) : '—'}</span>}
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${(s / 10) * 100}%`, background: col }} />
      </div>
    </div>
  )
}
