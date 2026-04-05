import { useCallback, useEffect, useState } from 'react'

const S = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    height: '280px',
    minHeight: '240px',
    background: 'var(--bg-2)',
    borderTop: '1px solid var(--border)',
    overflow: 'hidden',
  },
  header: {
    padding: '8px 12px',
    borderBottom: '1px solid var(--border-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
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
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflow: 'hidden',
    flex: 1,
  },
  description: {
    color: 'var(--text-dim)',
    fontSize: '11px',
    lineHeight: 1.6,
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-3)',
    color: 'var(--text)',
    fontSize: '12px',
  },
  textarea: {
    width: '100%',
    minHeight: '64px',
    resize: 'none',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg-3)',
    color: 'var(--text)',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  button: (disabled) => ({
    padding: '8px 10px',
    borderRadius: '8px',
    background: disabled ? 'var(--bg-3)' : 'var(--accent)',
    color: disabled ? 'var(--text-muted)' : 'var(--bg)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }),
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
    paddingTop: '4px',
    flex: 1,
    minHeight: 0,
  },
  item: {
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid var(--border-dim)',
    background: 'rgba(255,255,255,0.015)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  itemTitle: {
    color: 'var(--text)',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  itemMeta: {
    color: 'var(--text-muted)',
    fontSize: '10px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  itemDetails: {
    color: 'var(--text-dim)',
    fontSize: '11px',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  voteButton: {
    padding: '4px 8px',
    borderRadius: '999px',
    border: '1px solid rgba(0,217,255,0.18)',
    color: 'var(--accent)',
    background: 'rgba(0,217,255,0.06)',
    fontSize: '10px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  empty: {
    color: 'var(--text-muted)',
    fontSize: '11px',
    lineHeight: 1.6,
    padding: '4px 0',
  },
  error: {
    color: 'var(--red)',
    fontSize: '11px',
    lineHeight: 1.4,
  },
}

export default function CommunityPanel() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadRequests = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/feature-requests', { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (err) {
      setError(err.message || 'Could not load requests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadRequests() }, [loadRequests])

  const submit = useCallback(async (e) => {
    e.preventDefault()
    if (!title.trim() || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/feature-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ title: title.trim(), details: details.trim() }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setTitle('')
      setDetails('')
      await loadRequests()
    } catch (err) {
      setError(err.message || 'Could not submit request')
    } finally {
      setSubmitting(false)
    }
  }, [title, details, submitting, loadRequests])

  const vote = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/feature-requests/${id}/vote`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      await loadRequests()
    } catch (err) {
      setError(err.message || 'Could not vote')
    }
  }, [loadRequests])

  const top = items[0]

  return (
    <section style={S.panel}>
      <div style={S.header}>
        <div style={S.title}>Community voice</div>
        <div style={S.badge}>{items.length} open</div>
      </div>
      <div style={S.body}>
        <div style={S.description}>
          Capture feature ideas from the people. The best requests rise to the top and get built.
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            style={S.input}
            placeholder="Feature idea title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={120}
          />
          <textarea
            style={S.textarea}
            placeholder="What should Nexus do better?"
            value={details}
            onChange={e => setDetails(e.target.value)}
            maxLength={800}
          />
          <button style={S.button(submitting || !title.trim())} disabled={submitting || !title.trim()}>
            {submitting ? 'Submitting...' : 'Submit idea'}
          </button>
        </form>

        {error && <div style={S.error}>{error}</div>}

        <div style={S.list}>
          {loading && <div style={S.empty}>Loading requests...</div>}
          {!loading && items.length === 0 && <div style={S.empty}>No requests yet. Be the first to set the direction.</div>}
          {!loading && top && (
            <div style={S.item}>
              <div style={S.itemTop}>
                <div style={S.itemTitle}>{top.title}</div>
                <button style={S.voteButton} onClick={() => vote(top.id)}>+1</button>
              </div>
              <div style={S.itemMeta}>{top.status} · {top.votes || 0} votes · {new Date(top.created_at).toLocaleDateString()}</div>
              {top.details && <div style={S.itemDetails}>{top.details}</div>}
            </div>
          )}
          {!loading && items.slice(1, 4).map(item => (
            <article key={item.id} style={S.item}>
              <div style={S.itemTop}>
                <div style={S.itemTitle}>{item.title}</div>
                <button style={S.voteButton} onClick={() => vote(item.id)}>+1</button>
              </div>
              <div style={S.itemMeta}>{item.status} · {item.votes || 0} votes · {new Date(item.created_at).toLocaleDateString()}</div>
              {item.details && <div style={S.itemDetails}>{item.details}</div>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
