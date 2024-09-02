"use client";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { marketplaceItems } from "./components/data";
import { useRouter } from "next/navigation";

const Marketplace = () => {
  const { push } = useRouter();
  return (
    <GridContainer>
      {marketplaceItems.map((item) => (
        <GridItem key={item.id}>
          <Image src={item.image} alt={item.title} />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <button onClick={() => push("/event")}>Participate</button>
        </GridItem>
      ))}
    </GridContainer>
  );
};

export default Marketplace;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px 25px;
  padding: 100px 20px 20px;
`;

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

// <div className={style.searchBar}>
// <div className={style.searchIcon}>
//   <AiOutlineSearch />
// </div>
// <input
//   className={style.searchInput}
//   placeholder="search events and accounts"
// />
// </div>;
