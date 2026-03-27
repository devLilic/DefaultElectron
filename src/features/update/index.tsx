import type { ProgressInfo } from 'electron-updater'
import { useEffect, useState } from 'react'
import Modal from './components/Modal'
import Progress from './components/Progress'
import type { UpdateErrorPayload, VersionInfo } from '@/shared/types/update'
import './update.css'

const UpdateFeature = () => {
  const [checking, setChecking] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [versionInfo, setVersionInfo] = useState<VersionInfo>()
  const [updateError, setUpdateError] = useState<UpdateErrorPayload>()
  const [progressInfo, setProgressInfo] = useState<Partial<ProgressInfo>>()
  const [modalOpen, setModalOpen] = useState(false)
  const [readyToInstall, setReadyToInstall] = useState(false)

  const checkUpdate = async () => {
    setChecking(true)
    const result = await window.updateApi.checkForUpdates()
    setProgressInfo({ percent: 0 })
    setChecking(false)
    setModalOpen(true)

    if ((result as { error?: Error }).error) {
      setUpdateAvailable(false)
      setUpdateError(result as UpdateErrorPayload)
    }
  }

  useEffect(() => {
    const unsubscribeAvailability = window.updateApi.onAvailabilityChanged((payload) => {
      setVersionInfo(payload)
      setUpdateError(undefined)
      setReadyToInstall(false)
      setUpdateAvailable(payload.update)
    })

    const unsubscribeError = window.updateApi.onError((payload) => {
      setUpdateAvailable(false)
      setUpdateError(payload)
    })

    const unsubscribeProgress = window.updateApi.onDownloadProgress((payload) => {
      setProgressInfo(payload)
    })

    const unsubscribeDownloaded = window.updateApi.onDownloaded(() => {
      setProgressInfo({ percent: 100 })
      setReadyToInstall(true)
    })

    return () => {
      unsubscribeAvailability()
      unsubscribeError()
      unsubscribeProgress()
      unsubscribeDownloaded()
    }
  }, [])

  return (
    <>
      <Modal
        open={modalOpen}
        cancelText={readyToInstall ? 'Later' : 'Cancel'}
        okText={readyToInstall ? 'Install now' : 'Update'}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          if (readyToInstall) {
            void window.updateApi.quitAndInstall()
            return
          }

          void window.updateApi.startDownload()
        }}
        footer={updateAvailable ? null : undefined}
      >
        <div className='modal-slot'>
          {updateError ? (
            <div>
              <p>Error downloading the latest version.</p>
              <p>{updateError.message}</p>
            </div>
          ) : updateAvailable ? (
            <div>
              <div>The last version is: v{versionInfo?.newVersion}</div>
              <div className='new-version__target'>v{versionInfo?.version} -&gt; v{versionInfo?.newVersion}</div>
              <div className='update__progress'>
                <div className='progress__title'>Update progress:</div>
                <div className='progress__bar'>
                  <Progress percent={progressInfo?.percent} />
                </div>
              </div>
            </div>
          ) : (
            <div className='can-not-available'>{JSON.stringify(versionInfo ?? {}, null, 2)}</div>
          )}
        </div>
      </Modal>
      <button disabled={checking} onClick={() => void checkUpdate()}>
        {checking ? 'Checking...' : 'Check update'}
      </button>
    </>
  )
}

export default UpdateFeature
