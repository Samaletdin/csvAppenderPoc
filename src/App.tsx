import React from 'react'
import classNames from 'classnames'

// Import dropzone and file list components:
import { DropZone } from './Dropzone'
import { FileList } from './Filelist'

export const App = React.memo(() => {
  // Create "active" state for dropzone:
  const [isDropActive, setIsDropActive] = React.useState(false)
  // Create state for dropped files:
  const [files, setFiles] = React.useState<File[]>([])

  // Create handler for dropzone's onDragStateChange:
  const onDragStateChange = React.useCallback((dragActive: boolean) => {
    setIsDropActive(dragActive)
  }, [])

  // Create handler for dropzone's onFilesDrop:
  const onFilesDrop = React.useCallback((files: File[]) => {
    setFiles(files)
  }, [])

  return (
    <div
      className={classNames('dropZoneWrapper', {
        'dropZoneActive': isDropActive,
      })}
    >
      {/* Render the dropzone */}
      <DropZone onDragStateChange={onDragStateChange} onFilesDrop={onFilesDrop}>
        <h2>Drop your files here</h2>

        {files.length === 0 ? (
          <h3>No files to upload</h3>
        ) : (
          <h3>Files to upload: {files.length}</h3>
        )}

        {/* Render the file list */}
        <FileList files={files} />
      </DropZone>
    </div>
  )
})

App.displayName = 'App'

export default App