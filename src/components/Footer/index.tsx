import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  width: 100%;
  height: 250px;
  background: linear-gradient(-198.43494882292202deg, #4A9396 0%, #4A4F96 100%);
  padding: 50px 50px;
`;

const LinkItem = styled.div`
  color: #FFFFFE;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 45px;
  max-width: 500px;
`;

const Footer: React.FC<{}> = () => {
  return (
    <FooterContainer>
      <LinkItem>An <a href="https://github.com/Cryptonomic/Arronax" target="_blank">open-source</a> product by <a href="https://cryptonomic.tech" target="_blank">Cryptonomic</a></LinkItem>
      <LinkItem>Powered by <a href="https://github.com/Cryptonomic/Conseil" target="_blank">Conseil</a></LinkItem>
      <LinkItem>Built with <a href="https://github.com/Cryptonomic/ConseilJS" target="_blank">ConseilJS</a></LinkItem>
    </FooterContainer>
  );
}

export default Footer;