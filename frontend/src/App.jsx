import { useState, useCallback } from 'react'
import Header from './components/Header'
import FileExplorer from './components/FileExplorer'
import Chat from './components/Chat'

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'var(--bg)',
    overflow: 'hidden',
  },
  workspace: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    borderTop: '1px solid var(--border)',
  },
  divider: {
    width: '1px',
    background: 'var(--border)',
    flexShrink: 0,
  },
}

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  return (
    <div style={styles.app}>
      <Header />
      <div style={styles.workspace}>
        <FileExplorer
          refreshKey={refreshKey}
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
        />
        <div style={styles.divider} />
        <Chat
          selectedFile={selectedFile}
          onFsChange={refresh}
        />
      </div>
    </div>
  )
}
