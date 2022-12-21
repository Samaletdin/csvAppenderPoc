import React, { useState } from 'react'
import classNames from 'classnames'

// Import dropzone and file list components:
import { DropZone } from './Dropzone'
import { FileList } from './Filelist'
import { CsvUploadTab } from './component/UploadButton'

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

  const [updatedCsvFile, setUpdatedCsvFile] = useState(null); //add files here

  return (
    <div
      className={classNames('dropZoneWrapper', {
        'dropZoneActive': isDropActive,
      })}
    >
      {/* Render the dropzone */}
      
      <CsvUploadTab></CsvUploadTab>
    </div>
  )
})

App.displayName = 'App'

export default App