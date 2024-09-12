"use client";
import React from "react";
import styled from "styled-components";
import { marketplaceItems } from "./components/data";
import EventCard from "@/components/eventCard";

const Marketplace = () => {
  return (
    <GridContainer>
      {marketplaceItems.map((item) => (
        <EventCard
          key={item.id}
          description={item?.description}
          image={item.image}
          title={item.title}
        />
      ))}
    </GridContainer>
  );
};

export default Marketplace;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px 25px;
  padding: 120px 20px 60px;
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
