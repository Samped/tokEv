import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import styled from "styled-components";

interface props {
  image: StaticImageData;
  title: string;
  description: string;
}

const EventCard: FC<props> = ({ image, title, description }) => {
  const { push } = useRouter();

  return (
    <GridItem>
      <CardImage src={image} alt={title} />
      <Title>{title}</Title>
      <Desc>{description}</Desc>
      <PrimaryButton onClick={() => push("/event")}>Participate</PrimaryButton>
    </GridItem>
  );
};

export default EventCard;

const GridItem = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const CardImage = styled(Image)`
  width: 100%;
  height: auto;
  border-radius: 6px;
`;

const Title = styled.h3`
  font-size: 1.2em;
  margin: 10px 0;

  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin: 8px 0;
  }
`;

const Desc = styled.p`
  font-size: 1em;
  color: #333;
  min-height: 2.5em;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const PrimaryButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #005bb5;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
`;