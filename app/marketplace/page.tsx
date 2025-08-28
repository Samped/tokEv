"use client"; 
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWallet } from "../hooks/WalletProvider"; // Import from WalletProvider
import { ethers } from "ethers";
import { Interface } from "@ethersproject/abi";
import abi from "../src/abi/eventTicketing.json";

const Marketplace = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [visibleDescriptions, setVisibleDescriptions] = useState<Set<number>>(new Set());
  const [seatNumbers, setSeatNumbers] = useState<Record<number, number | null>>({});
  const { push } = useRouter();
  const { account, signer } = useWallet();

  // Fetch events from API (or your database)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/get-events"); // This can be a call to your backend API
        const data = await response.json();
        setEvents(data); // Assume data has fields like event.id, event.name, event.cost (price)
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleDescriptionToggle = (id: number) => {
    setVisibleDescriptions(prev => {
      const newVisibleDescriptions = new Set(prev);
      if (newVisibleDescriptions.has(id)) {
        newVisibleDescriptions.delete(id);
      } else {
        newVisibleDescriptions.add(id);
      }
      return newVisibleDescriptions;
    });
  };

  const handleSeatNumberChange = (eventId: number, value: number) => {
    setSeatNumbers((prevSeatNumbers) => ({
      ...prevSeatNumbers,
      [eventId]: value,
    }));
  };

  const buyTicket = async (eventId: number, seat: number, ticketPrice: number) => {
    if (!signer || !account) {
      alert("Please connect your wallet first.");
      return;
    }
  
    if (ticketPrice === undefined || ticketPrice === null || isNaN(ticketPrice)) {
      alert("Invalid ticket price.");
      return;
    }
  
    if (eventId === undefined || seat === undefined || seat === null || seat <= 0) {
      console.error("Invalid event or seat number.");
      alert("Invalid event or seat number.");
      return;
    }
  
    const iface = new Interface(abi);
    const functionName = "mint";
    const params = [eventId, seat];
  
    console.log("Parameters for minting:", params);
  
    let encodedData;
    try {
      encodedData = iface.encodeFunctionData(functionName, params);
      console.log("🔐 Encoded data:", encodedData);
    } catch (err) {
      console.error("❌ ABI encoding failed:", err);
      return;
    }
  
    try {
      // ✅ Convert ticket price (in ETH) to wei
      const value = ethers.utils.parseEther(ticketPrice.toString());
      console.log("💸 Ticket price in wei:", value.toString());
  
      // ✅ Estimate gas with value included
      const estimatedGas = await signer.estimateGas({
        to: "0xcc5661D1471e9e61B37Df5Ad5D2E1B2C5578c884",
        data: encodedData,
        value,
      });
  
      const feeData = await signer.getFeeData();
      const adjustedGasLimit = estimatedGas.add(ethers.BigNumber.from("10000")); // Add buffer
  
      // ✅ Send the transaction with correct value
      const tx = await signer.sendTransaction({
        to: "0xcc5661D1471e9e61B37Df5Ad5D2E1B2C5578c884",
        data: encodedData,
        gasLimit: adjustedGasLimit,
        maxFeePerGas: feeData.maxFeePerGas?.add(ethers.BigNumber.from("1000000000")),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.add(ethers.BigNumber.from("1000000000")),
        value,
      });
  
      console.log("Transaction sent:", tx.hash);
  
      const receipt = await tx.wait();
      console.log("🎉 Ticket purchased successfully!", receipt);
      alert("Ticket purchased successfully!");
    } catch (error) {
      console.error("❌ Error buying ticket:", error);
      alert("Transaction failed. Check console for details.");
    }
  };
  
  return (
    <GridContainer>
      {events.map((event) => (
        <GridItem key={event.eventId}>
          <ImageWrapper>
            <Image
              src="/bgImage.jpg"
              alt={event.name}
              fill
              style={{
                objectFit: "cover",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            />
          </ImageWrapper>
          <EventContent>
            <EventHeader>
              <h3>{event.name.toUpperCase()}</h3>
              <p>Price: {event.cost} TTrust</p> {/* Currency: TTrust */}
              <p>Event ID: {event.id}</p> {/* Display Event ID here */}
            </EventHeader>
            {visibleDescriptions.has(event.id) && (
              <EventDescription>{event.description}</EventDescription>
            )}
            
            {/* Input field for seat number specific to each event */}
            <Input
              type="number"
              placeholder="Enter Seat Number"
              value={seatNumbers[event.id] || ""}
              onChange={(e) => handleSeatNumberChange(event.id, Number(e.target.value))}
            />

            {/* Toggle Button for showing event description */}
            <ToggleButton onClick={() => handleDescriptionToggle(event.id)}>
              {visibleDescriptions.has(event.id) ? "Hide Description" : "Show Event Description"}
            </ToggleButton>

            <BuyButton
              onClick={() => {
                const seat = seatNumbers[event.id];
                const ticketPrice = event.cost; // Fetch ticket price from event data
                if (seat !== null && ticketPrice !== undefined) {
                  buyTicket(event.id, seat, ticketPrice);
                } else {
                  alert("Please enter a Seat Number and ensure the Ticket Price is valid.");
                }
              }}
            >
              Buy Ticket
            </BuyButton>
          </EventContent>
        </GridItem>
      ))}
    </GridContainer>
  );
};

export default Marketplace;

// Styled Components

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 45px 50px;
  padding: 130px 80px 60px;
  background-color: #001f3f; // dark blue
  min-height: 100vh;
`;

const GridItem = styled.div`
  background-color: rgba(185, 214, 238, 0.88);
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 500px;
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
`;

const EventContent = styled.div`
  padding: 10px;
  font-size: 0.8em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  overflow-x: auto;
`;

const EventHeader = styled.div`
  h3{
    font-size: 1.8em;
    margin-right: 20px;
  },
  p {
    margin: 0;
    font-size: 1em;
    font-weight: bold;
    padding: 1px -20px;
    margin-right: 20px;
  }
`;

const Input = styled.input`
  padding: 6px;
  font-size: 0.9em; /* Slightly smaller font size */
  width: 100px; /* Set a fixed width for the input field */
  margin-top: 20px;
  border-radius: 4px;
  background-color: rgb(214, 223, 233);
`;

const BuyButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 8px 35px;
  font-size: 1.1em;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
  justify-content: center;

  &:hover {
    background-color: #005bb5;
  }
`;

const EventDescription = styled.p`
  font-size: 1em;
  color: #333;
  margin: 0;
`;

const ToggleButton = styled.button`
  background-color: transparent;
  color: #0070f3;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  font-size: 0.9em;
  

  &:hover {
    text-decoration: underline;
  }
`;
