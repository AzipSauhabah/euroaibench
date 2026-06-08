interface Props { icon?: string; title: string; sub?: string; action?: React.ReactNode }
export function EmptyState({ icon = '⚖', title, sub, action }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-text">{title}</div>
      {sub && <div className="empty-sub">{sub}</div>}
      {action && <div style={{ marginTop: '1.5rem' }}>{action}</div>}
    </div>
  )
}
