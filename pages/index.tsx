import Link from 'next/link'
import styled from 'styled-components'

const Button = styled.button`
  padding: 20px;
  border: solid 1px black;

  &:hover {
    background-color: black;
    color: white;
  }
`

const DisabledButton = styled(Button)`
  opacity: 0.4;
  pointer-events: none;
`

const Index = ()  => {
  return (
    <div>
      <h1>Pocket Space</h1>
      <DisabledButton>
        <Link href='/local'>
          <a>local mode</a>
        </Link>
      </DisabledButton>
      <Button>
        <Link href='/remote'>
          <a>remote mode</a>
        </Link>
      </Button>
    </div>
  )
}

export default Index;
