import Link from 'next/link'
import { ButtonGroup, Button } from '@material-ui/core';

const Index = ()  => {
  return (
    <div>
      <h1>Pocket Space</h1>
      <ButtonGroup size="large" color="primary" aria-label="connect mode">
        <Button disabled>
          <Link href='/local'>LOCAL MODE</Link>
        </Button>
        <Button>
          <Link href='/remote'>REMOTE MODE</Link>
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default Index;
