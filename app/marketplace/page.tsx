"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWallet } from '../hooks/useWallet'; // Import the custom hook
import { Interface } from 'ethers';
import abi from '../src/abi/eventTicketing.json';

const Marketplace = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [visibleDescription, setVisibleDescription] = useState<number | null>(null);
  const { push } = useRouter();

  // State to track event ID and seat number
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [seatNumber, setSeatNumber] = useState<number | null>(null);

  // Use the custom useWallet hook
  const { account, walletClient } = useWallet();

  const handleDescriptionToggle = (id: number) => {
    setVisibleDescription(visibleDescription === id ? null : id);
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/get-events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const buyTicket = async (eventId: number, seat: number, ticketPrice: number) => {
    if (!walletClient || !account) {
      alert("Please connect your wallet first.");
      return;
    }

    const iface = new Interface(abi);
    const functionName = 'mint'; 
    const params = [eventId, seat]; // Pass eventId and seat number
    const encodedData = iface.encodeFunctionData(functionName, params);

    try {

      const adjustedTicketPrice = ticketPrice + 0.01;
      // Send the transaction
      const txHash = await walletClient.sendTransaction({
        account: account as `0x${string}`,
        to: '0x3dE7a4C348F7415087a9Cf58FBC57256bAF1eb4b', // Replace with your contract address
        data: encodedData as `0x${string}`,
        value: BigInt(adjustedTicketPrice * 1e18), 
        gas: BigInt(4000000),
      });

      console.log(`Transaction hash: ${txHash}`);

      // Poll for transaction receipt
      const provider = walletClient.provider;
      let receipt = null;
      while (receipt === null) {
        receipt = await provider.getTransactionReceipt(txHash);
        if (receipt === null) {
          // Wait for a while before polling again
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
        }
      }

      console.log("Ticket purchased successfully!");
    } catch (error) {
      console.error("Error buying ticket:", error);
    }
  };

  return (
    <GridContainer>
      {events.map((event) => (
        <GridItem key={event.id}>
          <Image src={event.picture} alt={event.name} width={300} height={200} />
          <EventContent>
            <EventHeader>
              <h3>{event.name.toUpperCase()}</h3>
              <p>Price: {event.cost} RWA</p>
            </EventHeader>
            {visibleDescription === event.id && (
              <EventDescription>{event.description}</EventDescription>
            )}
            <ToggleButton onClick={() => handleDescriptionToggle(event.id)}>
              {visibleDescription === event.id ? 'Hide Description' : 'Show Description'}
            </ToggleButton>

            {/* Input fields for event ID and seat number */}
            <Input
              type="number"
              placeholder="Enter Event ID"
              value={selectedEventId ?? ''}
              onChange={(e) => setSelectedEventId(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Enter Seat Number"
              value={seatNumber ?? ''}
              onChange={(e) => setSeatNumber(Number(e.target.value))}
            />

            <BuyButton
              onClick={() => {
                if (selectedEventId && seatNumber !== null) {
                  buyTicket(selectedEventId, seatNumber, event.cost);
                } else {
                  alert("Please enter both Event ID and Seat Number.");
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
  gap: 40px 30px; 
  padding: 130px 20px 60px;
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9; 
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px; 
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%; 
  margin-top: 0px;
`;

const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  justify-content: space-between;
`;

const EventHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0px;

  h3 {
    margin: 0;
    padding: 20px;
    font-weight: bold;
  }

  p {
    margin: 0;
    padding: 20px;
    font-weight: bold;
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

const BuyButton = styled.button`
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
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 1em;
`;
