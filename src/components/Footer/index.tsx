
import * as React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  width: 100%;
  height: 301px;
  background: linear-gradient(-198.43494882292202deg, #4A9396 0%, #4A4F96 100%);
  padding: 60px 89px;
`;

const LinkItem = styled.div`
  color: #FFFFFE;
  font-size: 18px;
  letter-spacing: 3px;
  line-height: 45px;
  cursor: pointer;
  max-width: 113px;
`;



const Footer: React.StatelessComponent<{}> = () => {
  return (
    <FooterContainer>
      <LinkItem>About</LinkItem>
      <LinkItem>Resources</LinkItem>
      <LinkItem>Charts</LinkItem>
      <LinkItem>News</LinkItem>
    </FooterContainer>
  );
}

export default Footer;