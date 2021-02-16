import React from 'react'
import Image from 'next/image'
import styled from 'styled-components'

const Footer = () => {
  return (
    <FooterContainer>
      <ImageBox>
        <Image src='/raihara3.png' width='30' height='30' />
      </ImageBox>
      <CopyRight>&copy;2021 raihara3</CopyRight>
    </FooterContainer>
  )
}

const FooterContainer = styled.footer`
  margin: 30px 0 0;
  padding: 20px 0;
  text-align: center;
`

const ImageBox = styled.div`
  height: 30px;
`

const CopyRight = styled.small`
  color: rgba(255,255,255,0.3)
`

export default Footer
