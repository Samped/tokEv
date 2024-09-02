"use client";
import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";
import bgImage from "../../public/Image5.jpg";

const Hero = () => {
  return (
    <Background>
      <TextWrap>
        <H1>Welcome to this Event!</H1>
        <P>
          We're revolutionizing the ways important occurences are documented.
          Tokenize your events, or whatever is happening around you.
        </P>
        <CtaContainer>
          <Link href="/marketplace">
            <AccentedButton>Explore</AccentedButton>
          </Link>
          <Button>Create</Button>
        </CtaContainer>
      </TextWrap>

      <Image src={bgImage} alt="Background Image" />
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

  & > img {
    width: 65%;
  }
`;

const CtaContainer = styled.div`
  display: flex;
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
`;

const H1 = styled.h1`
  position: relative;
  color: white;
  font-size: 2.875rem;
  font-weight: bold;
`;

const P = styled.p`
  color: #8a939b;
  font-size: 1.5rem;
  margin-top: 0.8rem;
  margin-bottom: 2.5rem;
`;

const TextWrap = styled.div`
  color: white;
  flex-shrink: 0;
  width: 40%;
`;
