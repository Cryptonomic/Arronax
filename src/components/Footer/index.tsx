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
const Link = styled.a`
  color: #56c2d9;
  text-decoration: none;
`;

declare var VERSION: string, COMMITHASH: string;

const Footer: React.FC<{}> = () => {
  const version: string = VERSION;
  const commitLink: string = `https://github.com/Cryptonomic/Arronax/tree/${COMMITHASH}`;
  return (
    <FooterContainer>
      <LinkItem>An <Link href="https://github.com/Cryptonomic/Arronax" target="_blank" rel="noopener noreferrer">open-source</Link> product by <Link href="https://cryptonomic.tech" target="_blank" rel="noopener noreferrer">Cryptonomic</Link></LinkItem>
      <LinkItem>Powered by <Link href="https://github.com/Cryptonomic/Conseil" target="_blank" rel="noopener noreferrer">Conseil</Link></LinkItem>
      <LinkItem>Built with <Link href="https://github.com/Cryptonomic/ConseilJS" target="_blank" rel="noopener noreferrer">ConseilJS</Link></LinkItem>
      <LinkItem>Version <Link href={commitLink} target="_blank" rel="noopener noreferrer">{version}</Link></LinkItem>
    </FooterContainer>
  );
}

export default Footer;