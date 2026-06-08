interface Props { type: string; children: React.ReactNode }
export function Badge({ type, children }: Props) {
  return <span className={`badge badge-${type.toLowerCase().replace('mifid2','mifid2')}`}>{children}</span>
}
