import Image from "next/image";
import telegram from "../public/telegram.png";
import facebook from "../public/facebook.png";
import discord from "../public/discord.png";
import tokEv2 from "../public/tokEv2.png";
import styled from "styled-components";

const Footer = () => {
  return (
    <Container>
      <Logo>
        <LogoWrapper>
          <Image src={tokEv2} alt="tokEvLogo" width={100} height={100} />
        </LogoWrapper>
        tokEv
      </Logo>

      <SocialMediaWraper>
        <SocialMedia>
          <Image src={telegram} alt="Telegram" width={32} height={32} />
          <Icon>Telegram</Icon>
        </SocialMedia>
        <SocialMedia>
          <Image src={facebook} alt="Facebook" width={32} height={32} />
          <Icon>Facebook</Icon>
        </SocialMedia>
        <SocialMedia>
          <Image src={discord} alt="Discord" width={32} height={32} />
          <Icon>Discord</Icon>
        </SocialMedia>
      </SocialMediaWraper>
    </Container>
  );
};

export default Footer;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  width: 100%;
  background: black;
  padding: 0 25px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  color: white;
  cursor: pointer;
`;

const LogoWrapper = styled.div`
  width: 70px;
  height: 70px;
  overflow: hidden;

  & > img {
    transform: scale(1.4);
    margin-top: 4px;
  }
`;

const SocialMediaWraper = styled.div`
  display: flex;
  align-items: center;
  gap: 35px;
`;

const SocialMedia = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const Icon = styled.div`
  display: flex;
  justify-content: right;
  height: 100%;
`;
