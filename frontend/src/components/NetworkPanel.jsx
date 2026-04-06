import { useEffect, useState } from 'react'

const API_URL = import.meta.env?.VITE_NEXUS_NETWORK_API
  ?? 'https://network.nexus.computer/api/stats'

const PRODUCTS = [
  { key: 'nexus',          label: 'Nexus' },
  { key: 'nexus-hosting',  label: 'Hosting' },
  { key: 'nexus-cloud',    label: 'Cloud' },
  { key: 'nexus-deploy',   label: 'Deploy' },
  { key: 'nexus-computer', label: '.computer' },
  { key: 'nexus-vault',    label: 'Vault' },
]

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toLocaleString()
}

function fmtRam(gb) {
  if (gb >= 1024) return (gb / 1024).toFixed(1) + ' TB'
  return Math.round(gb) + ' GB'
}

const S = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--bg-2)',
    overflow: 'hidden',
  },
  header: {
    padding: '8px 12px',
    borderBottom: '1px solid var(--border-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    flexShrink: 0,
  },
  title: {
    fontSize: '10px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    fontWeight: 700,
  },
  badge: {
    fontSize: '9px',
    padding: '2px 6px',
    borderRadius: '999px',
    border: '1px solid rgba(61,255,160,0.2)',
    color: 'var(--green)',
    background: 'rgba(61,255,160,0.04)',
    letterSpacing: '0.08em',
  },
  body: {
    padding: '10px 12px',
    overflowY: 'auto',
    flex: 1,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
    marginBottom: '12px',
  },
  metricCard: {
    background: 'var(--bg-3)',
    border: '1px solid var(--border-dim)',
    borderRadius: '6px',
    padding: '7px 9px',
  },
  metricLabel: {
    fontSize: '9px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    marginBottom: '3px',
  },
  metricValue: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1,
    fontFamily: 'var(--font-mono)',
  },
  sectionLabel: {
    fontSize: '9px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    marginBottom: '6px',
    fontWeight: 700,
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '5px',
  },
  productName: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    minWidth: '62px',
  },
  barTrack: {
    flex: 1,
    height: '3px',
    background: 'var(--bg-3)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  productCount: {
    fontSize: '10px',
    color: 'var(--text-dim)',
    minWidth: '28px',
    textAlign: 'right',
    fontFamily: 'var(--font-mono)',
  },
  footer: {
    padding: '7px 12px',
    borderTop: '1px solid var(--border-dim)',
    fontSize: '9px',
    color: 'var(--text-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  dot: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: 'var(--green)',
    display: 'inline-block',
    marginRight: '5px',
    animation: 'nxpulse 2s infinite',
  },
}

export default function NetworkPanel() {
  const [stats, setStats] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = () =>
      fetch(API_URL)
        .then(r => r.json())
        .then(d => {
          if (cancelled) return
          setStats(d)
          setLastUpdate(new Date())
        })
        .catch(() => {})

    load()
    const t = setInterval(load, 30_000)
    return () => { cancelled = true; clearInterval(t) }
  }, [])

  const maxCount = stats
    ? Math.max(...PRODUCTS.map(p => stats.product_counts?.[p.key] ?? 0), 1)
    : 1

  return (
    <div style={S.panel}>
      <style>{`@keyframes nxpulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>

      <div style={S.header}>
        <div style={S.title}>
          <span style={S.dot} />
          Nexus Network
        </div>
        {stats && (
          <div style={S.badge}>
            {fmt(stats.nodes_online)} nodes
          </div>
        )}
      </div>

      <div style={S.body}>
        {!stats ? (
          <div style={{ color: 'var(--text-dim)', fontSize: '11px', padding: '8px 0' }}>
            Connecting to federation mesh…
          </div>
        ) : (
          <>
            <div style={S.metricsGrid}>
              <div style={S.metricCard}>
                <div style={S.metricLabel}>Nodes</div>
                <div style={{ ...S.metricValue, color: 'var(--green)' }}>{fmt(stats.nodes_online)}</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricLabel}>Collective RAM</div>
                <div style={S.metricValue}>{fmtRam(stats.total_ram_gb)}</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricLabel}>CPU Cores</div>
                <div style={S.metricValue}>{fmt(stats.total_cpu_cores)}</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricLabel}>Compute Jobs</div>
                <div style={{ ...S.metricValue, color: 'var(--amber, #BA7517)' }}>{fmt(stats.compute_jobs_hour)}</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricLabel}>Storage</div>
                <div style={S.metricValue}>{fmtRam(stats.total_storage_gb)}</div>
              </div>
              <div style={S.metricCard}>
                <div style={S.metricLabel}>Countries</div>
                <div style={S.metricValue}>{stats.countries}</div>
              </div>
            </div>

            <div style={S.sectionLabel}>Product adoption</div>
            {PRODUCTS.map(p => {
              const count = stats.product_counts?.[p.key] ?? 0
              const pct = Math.round((count / maxCount) * 100)
              return (
                <div key={p.key} style={S.productRow}>
                  <div style={S.productName}>{p.label}</div>
                  <div style={S.barTrack}>
                    <div style={{
                      width: pct + '%',
                      height: '100%',
                      background: 'var(--green)',
                      borderRadius: '2px',
                      transition: 'width 0.8s ease',
                    }} />
                  </div>
                  <div style={S.productCount}>{fmt(count)}</div>
                </div>
              )
            })}
          </>
        )}
      </div>

      <div style={S.footer}>
        <span>Opt-in · no personal data</span>
        <span>{lastUpdate ? lastUpdate.toLocaleTimeString() : '—'}</span>
      </div>
    </div>
  )
}
