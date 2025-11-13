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
  const [takenSeats, setTakenSeats] = useState<Record<number, number[]>>({});
  const [availableSeats, setAvailableSeats] = useState<Record<number, number[]>>({});
  const { push } = useRouter();
  const { account, signer } = useWallet();
  const CONTRACT_ADDRESS = "0x14A09cdE2841385079608F16FDF71569138F554F";

  // Fetch taken seats for an event
  const fetchTakenSeats = async (eventId: number, maxTickets: number) => {
    if (!signer) return;
    
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const taken = await contract.getSeatsTaken(eventId);
      const takenArray = taken.map((seat: any) => Number(seat.toString()));
      
      setTakenSeats(prev => ({
        ...prev,
        [eventId]: takenArray
      }));

      // Calculate available seats
      const allSeats = Array.from({ length: maxTickets }, (_, i) => i + 1);
      const available = allSeats.filter(seat => !takenArray.includes(seat));
      setAvailableSeats(prev => ({
        ...prev,
        [eventId]: available
      }));
    } catch (error) {
      console.error(`Error fetching taken seats for event ${eventId}:`, error);
    }
  };

  // Fetch events from API (or your database)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/get-events");
        const data = await response.json();
        setEvents(data);
        
        // Fetch taken seats for each event
        if (signer) {
          data.forEach((event: any) => {
            if (event.numOfTickets) {
              fetchTakenSeats(event.id, event.numOfTickets);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

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
        to: CONTRACT_ADDRESS,
        data: encodedData,
        value,
      });

      const feeData = await signer.getFeeData();
      const adjustedGasLimit = estimatedGas.add(ethers.BigNumber.from("10000")); // Add buffer

      // ✅ Send the transaction with correct value
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
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
    } catch (error: any) {
      console.error("❌ Error buying ticket:", error);
      
      // Check if error is about seat already taken
      const errorMessage = error?.message || error?.error?.message || error?.data?.message || "";
      const errorString = errorMessage.toString().toLowerCase();
      
      if (errorString.includes("seat already taken") || errorString.includes("seat already")) {
        // Fetch updated taken seats
        const event = events.find(e => e.id === eventId);
        if (event?.numOfTickets) {
          await fetchTakenSeats(eventId, event.numOfTickets);
        }
        
        const available = availableSeats[eventId] || [];
        const taken = takenSeats[eventId] || [];
        
        let message = "Seat already taken!\n\n";
        
        if (available.length > 0) {
          const availablePreview = available.slice(0, 20).join(", ");
          const moreText = available.length > 20 ? ` and ${available.length - 20} more` : "";
          message += `Available seats: ${availablePreview}${moreText}\n`;
          message += `(Total available: ${available.length} of ${event?.numOfTickets || 'N/A'})`;
        } else {
          message += "No seats available. All seats are taken.";
        }
        
        alert(message);
      } else {
        alert(`Transaction failed: ${errorMessage || "Check console for details."}`);
      }
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
              <p>Price: {event.cost} Tea</p> {/* Currency: Tea */}
              <p>Event ID: {event.id}</p> {/* Display Event ID here */}
            </EventHeader>
            {visibleDescriptions.has(event.id) && (
              <EventDescription>{event.description}</EventDescription>
            )}
            
            {/* Input field for seat number specific to each event */}
            <SeatInputWrapper>
              <Input
                type="number"
                placeholder="Enter Seat Number"
                value={seatNumbers[event.id] || ""}
                onChange={(e) => handleSeatNumberChange(event.id, Number(e.target.value))}
              />
              {availableSeats[event.id] && availableSeats[event.id].length > 0 && (
                <AvailableSeatsInfo>
                  {availableSeats[event.id].length} seats available
                </AvailableSeatsInfo>
              )}
            </SeatInputWrapper>

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
  padding: 130px 80px 80px; /* extra bottom so blue extends beyond content */
  background-color: #001f3f; // dark blue
  min-height: 100vh;
  width: 100vw; /* full-bleed */
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 120px 48px 72px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 24px;
    padding: 100px 16px 64px; /* leave room for fixed header */
  }
`;

const GridItem = styled.div`
  background-color: rgba(185, 214, 238, 0.88);
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 560px;
  justify-self: center;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 260px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const EventContent = styled.div`
  padding: 12px;
  font-size: 0.9em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  overflow-x: auto;
`;

const EventHeader = styled.div`
  h3{
    font-size: 1.4em;
    margin-right: 12px;
  },
  p {
    margin: 0;
    font-size: 0.95em;
    font-weight: bold;
    padding: 1px -20px;
    margin-right: 12px;
  }
`;

const Input = styled.input`
  padding: 6px;
  font-size: 0.9em; /* Slightly smaller font size */
  width: 110px; /* Set a fixed width for the input field */
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

const SeatInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
`;

const AvailableSeatsInfo = styled.p`
  font-size: 0.75em;
  color: #28a745;
  margin: 0;
  font-weight: 600;
`;
