import { useEffect, useState, useCallback } from 'react'

/* ── icons ── */
const FolderIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
)

const FileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
    <polyline points="13 2 13 9 20 9"/>
  </svg>
)

const RefreshIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

/* ── helpers ── */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`
  return `${(bytes / 1024 / 1024).toFixed(1)}M`
}

function fileExt(name) {
  return name.split('.').pop()?.toLowerCase() || ''
}

function extColor(name) {
  const ext = fileExt(name)
  const map = {
    js: '#f0db4f', jsx: '#61dafb', ts: '#3178c6', tsx: '#61dafb',
    py: '#3dba5e', sh: '#3dffa0', md: '#a0c4ff', json: '#ffb830',
    html: '#e34c26', css: '#264de4', txt: 'var(--text-dim)',
  }
  return map[ext] || 'var(--text-dim)'
}

/* ── styles ── */
const S = {
  panel: {
    width: '240px',
    minWidth: '180px',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-2)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottom: '1px solid var(--border)',
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  refreshBtn: {
    color: 'var(--text-dim)',
    padding: '2px',
    borderRadius: 'var(--radius)',
    transition: 'color 0.15s',
    display: 'flex',
    alignItems: 'center',
  },
  tree: {
    flex: 1,
    overflowY: 'auto',
    padding: '6px 0',
  },
  item: (selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    cursor: 'pointer',
    background: selected ? 'rgba(0,217,255,0.06)' : 'transparent',
    borderLeft: selected ? '2px solid var(--accent)' : '2px solid transparent',
    transition: 'background 0.1s',
    userSelect: 'none',
    fontSize: '12px',
  }),
  itemName: (isDir, selected) => ({
    color: isDir ? 'var(--text)' : (selected ? 'var(--accent)' : 'var(--text)'),
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  itemSize: {
    color: 'var(--text-muted)',
    fontSize: '10px',
    flexShrink: 0,
  },
  viewer: {
    borderTop: '1px solid var(--border)',
    background: 'var(--bg)',
    maxHeight: '40%',
    display: 'flex',
    flexDirection: 'column',
  },
  viewerHeader: {
    padding: '6px 12px',
    fontSize: '10px',
    color: 'var(--text-dim)',
    letterSpacing: '0.08em',
    borderBottom: '1px solid var(--border-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewerContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px 12px',
    fontSize: '11px',
    lineHeight: 1.6,
    color: 'var(--text)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  empty: {
    padding: '24px 12px',
    color: 'var(--text-muted)',
    fontSize: '11px',
    textAlign: 'center',
  },
}

/* ── Tree item ── */
function TreeItem({ item, depth = 0, selectedFile, onSelect }) {
  const [open, setOpen] = useState(false)
  const [children, setChildren] = useState([])

  const isSelected = selectedFile?.path === item.path

  const toggle = useCallback(async () => {
    if (!item.is_dir) {
      onSelect(item)
      return
    }
    if (!open) {
      const res = await fetch(`/api/files?path=${encodeURIComponent(item.path)}`)
      const data = await res.json()
      setChildren(data.items || [])
    }
    setOpen(o => !o)
  }, [item, open, onSelect])

  return (
    <>
      <div
        style={{ ...S.item(isSelected), paddingLeft: `${12 + depth * 14}px` }}
        onClick={toggle}
        onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
        onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
      >
        {item.is_dir && <ChevronIcon open={open} />}
        <span style={{ color: item.is_dir ? 'var(--amber)' : extColor(item.name), flexShrink: 0 }}>
          {item.is_dir ? <FolderIcon /> : <FileIcon />}
        </span>
        <span style={S.itemName(item.is_dir, isSelected)}>{item.name}</span>
        {!item.is_dir && item.size > 0 && (
          <span style={S.itemSize}>{formatSize(item.size)}</span>
        )}
      </div>
      {open && children.map(child => (
        <TreeItem
          key={child.path}
          item={child}
          depth={depth + 1}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

/* ── Main component ── */
export default function FileExplorer({ refreshKey, onFileSelect, selectedFile }) {
  const [items, setItems] = useState([])
  const [fileContent, setFileContent] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadRoot = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/files')
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadRoot() }, [loadRoot, refreshKey])

  const handleSelect = useCallback(async (item) => {
    onFileSelect(item)
    if (!item.is_dir) {
      try {
        const res = await fetch(`/api/files/read?path=${encodeURIComponent(item.path)}`)
        const data = await res.json()
        setFileContent(data.content)
      } catch {
        setFileContent('(error reading file)')
      }
    }
  }, [onFileSelect])

  return (
    <div style={S.panel}>
      <div style={S.panelHeader}>
        <span>Workspace</span>
        <button
          style={S.refreshBtn}
          onClick={loadRoot}
          title="Refresh"
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
        >
          <RefreshIcon />
        </button>
      </div>

      <div style={S.tree}>
        {loading && <div style={S.empty}>Loading...</div>}
        {!loading && items.length === 0 && (
          <div style={S.empty}>Workspace is empty.<br />Ask Nexus to create something.</div>
        )}
        {items.map(item => (
          <TreeItem
            key={item.path}
            item={item}
            selectedFile={selectedFile}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {selectedFile && !selectedFile.is_dir && fileContent !== null && (
        <div style={S.viewer}>
          <div style={S.viewerHeader}>
            <span style={{ color: extColor(selectedFile.name) }}>{selectedFile.name}</span>
            <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
              onClick={() => { setFileContent(null); onFileSelect(null) }}>✕</span>
          </div>
          <div style={S.viewerContent}>{fileContent}</div>
        </div>
      )}
    </div>
  )
}
