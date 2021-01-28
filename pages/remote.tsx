import { useEffect, useState, useCallback } from "react"
import { Button } from '@material-ui/core';
import WebXR from '../utils/WebXR'
import WebGL from '../core/service/WebGL'

const Remote = () => {
  const [isSupported, setIsSupported] = useState(false)

  const onCreateSession = useCallback(() => {
    const canvas = document.getElementById('webAR') as HTMLCanvasElement
    const webGL = new WebGL(canvas)
    new WebXR(webGL, {requiredFeatures: ['local', 'hit-test']}).createSession()
  }, [])

  useEffect(() => {
    setIsSupported('xr' in navigator)
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
