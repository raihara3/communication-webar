import Link from 'next/link'
import styled from 'styled-components'

const Button = styled.button`
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

const Atag = styled.a`
  display: inline-block;
  padding: 20px;
`

const Index = ()  => {
  return (
    <div>
      <h1>Pocket Space</h1>
      <DisabledButton>
        <Link href='/local'>
          <Atag>local mode</Atag>
        </Link>
      </DisabledButton>
      <Button>
        <Link href='/remote'>
          <Atag>remote mode</Atag>
        </Link>
      </Button>
    </div>
  )
}

export default Index;
