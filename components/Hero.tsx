import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";
import bgImage from "../public/bgImage2.jpg";
import { useRouter } from "next/navigation";

const Hero = () => {
  const { push } = useRouter();
  return (
    <Background>
      <TextWrap>
        <H1>Welcome to tokEv!</H1>
        <P>
          Bringing events onchain, and enabling you stream your favourite events with one click.
        </P>
        <CtaContainer>
          <Link href="/marketplace">
            <AccentedButton>Explore</AccentedButton>
          </Link>
          <Button onClick={() => push("event/create")}>Create</Button>
        </CtaContainer>
      </TextWrap>

      <HeroImage src={bgImage} alt="Background Image" />
    </Background>
  );
};

export default Hero;

const Background = styled.div`
  display: flex;
  background-color: black;
  height: 100vh;
  position: relative;
  justify-content: left;
  align-items: center;
  padding: 0px 100px;
  color: white;

  @media (max-width: 1024px) {
    padding: 0 48px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    gap: 24px;
    height: auto;
    padding: 100px 16px 40px; /* leave room for fixed header */
    text-align: center;
  }
`;

const CtaContainer = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const AccentedButton = styled.button`
  position: relative;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  background-color: #2181e2;
  border-radius: 0.5rem;
  margin-right: 1.25rem;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #42a0ff;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.6rem;
    margin-right: 0;
  }
`;

const Button = styled.button`
  position: relative;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  background-color: #363840;
  border-radius: 0.5rem;
  margin-right: 1.25rem;
  color: #e4e8ea;
  cursor: pointer;
  &:hover {
    background-color: #4c505c;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.6rem;
    margin-right: 0;
  }
`;

const H1 = styled.h1`
  position: relative;
  color: white;
  font-size: 2.875rem;
  font-weight: bold;

  @media (max-width: 1024px) {
    font-size: 2.25rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const P = styled.p`
  color: #8a939b;
  font-size: 1.7rem;
  margin-top: 0.8rem;
  margin-bottom: 2.5rem;

  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1.4rem;
  }
`;

const TextWrap = styled.div`
  color: white;
  flex-shrink: 0;
  width: 40%;

  @media (max-width: 1024px) {
    width: 48%;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeroImage = styled(Image)`
  width: 65%;
  height: auto;

  @media (max-width: 1024px) {
    width: 50%;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 520px;
    opacity: 0.85;
    border-radius: 12px;
  }
`;
