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
      <Image src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={() => push("/event")}>Participate</button>
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

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  h3 {
    font-size: 1.2em;
    margin: 10px 0;
  }

  p {
    font-size: 1em;
    color: #333;
  }

  button {
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
  }
`;
