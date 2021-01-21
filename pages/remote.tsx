import { useEffect, useState, useCallback } from "react"
import { Button } from '@material-ui/core';
import WebXR from '../utils/WebXR'
import ThreeJS from '../utils/ThreeJS'

const Remote = () => {
  const [isSupported, setIsSupported] = useState(false)
  const threeJS = new ThreeJS('webAR')

  const onCreateSession = useCallback(() => {
    new WebXR(threeJS, {requiredFeatures: ['local', 'hit-test']}).createSession()
  }, [])

  useEffect(() => {
    setIsSupported('xr' in navigator)
    threeJS.init()
  }, [])

  return (
    <>
      <div>remote</div>
      {isSupported ? (
        <Button
          variant='outlined'
          color='primary'
          onClick={() => onCreateSession()}
        >
          START AR
        </Button>
      ) : (
        <a href='https://immersiveweb.dev/'>
          WebXR not available
        </a>
      )}
      <canvas id='webAR'></canvas>
    </>
  )
}

export default Remote
