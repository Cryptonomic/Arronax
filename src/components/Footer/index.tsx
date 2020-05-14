import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';

const FooterContainer = styled.div`
  width: 100%;
  background: linear-gradient(-198.435deg, rgb(74, 147, 150) 0%, rgb(74, 79, 150) 100%);
  padding: 50px 50px 10px 50px;
`;

const LinkItem = styled.div`
  color: #FFFFFE;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 45px;
`;
const Link = styled.a`
  color: #56c2d9;
  text-decoration: none;
`;

// const LanguageContainer = styled.div`
//   display: flex;
//   justify-content: center;
// `;

// const LanguageItem = styled.div<{isFirst: boolean}>`
//   color: #ffffff;
//   padding: 0 5px;
//   border-left: ${({ isFirst }) => (!isFirst && '1px solid rgba(255, 255, 255, 0.2)')};
//   line-height: 18px;
//   cursor: pointer;
// `;

// const langs = ['en', 'zh-TW', 'ru', 'fr'];

const Footer: React.FC<{}> = () => {
  const version: string = `${process.env.REACT_APP_VERSION?.split('-').map((t: string) => t.slice(0, 1).toLocaleUpperCase() + t.slice(1)).join(' ')}-${process.env.REACT_APP_GIT_SHA}`;
  const commitLink: string = `https://github.com/Cryptonomic/Arronax/tree/${process.env.REACT_APP_GIT_SHA}`;
  // const { i18n } = useTranslation();

  // const changeLanguage = (lng: any) => {
  //   i18n.changeLanguage(lng);
  // };

  return (
    <FooterContainer>
      <Trans i18nKey="components.footer.link_tran" values={{ version }}>
        <LinkItem>An <Link href="https://github.com/Cryptonomic/Arronax" target="_blank" rel="noopener noreferrer">open-source</Link> product by <Link href="https://cryptonomic.tech" target="_blank" rel="noopener noreferrer">Cryptonomic</Link></LinkItem>
        <LinkItem>Powered by <Link href="https://github.com/Cryptonomic/Conseil" target="_blank" rel="noopener noreferrer">Conseil</Link></LinkItem>
        <LinkItem>Built with <Link href="https://github.com/Cryptonomic/ConseilJS" target="_blank" rel="noopener noreferrer">ConseilJS</Link></LinkItem>
        <LinkItem>Version <Link href={commitLink} target="_blank" rel="noopener noreferrer">{version}</Link></LinkItem>
      </Trans>
      {/*<LanguageContainer>
        {langs.map((lang, index) => (
          <LanguageItem key={lang} isFirst={index === 0} onClick={() => changeLanguage(lang)}>{lang}</LanguageItem>
        ))}
        </LanguageContainer>*/}
    </FooterContainer>
  );
}

export default Footer;
