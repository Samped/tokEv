"use client";  // <-- Add this line at the top of the file

import { Interface } from '@ethersproject/abi';
import { BigNumberish, ethers } from 'ethers';
import React, { useState, useEffect } from "react";
import styled from "styled-components"; 
import abi from '../../src/abi/eventTicketing.json'; 
import { useWallet } from "@/app/hooks/WalletProvider";
import { useRouter } from "next/navigation"; // Import the useRouter hook for redirection

const CreateForm = () => {
  const { account, connectWallet, signer } = useWallet();
  const [formState, setFormState] = useState({
    name: "",
    picture: "",
    description: "",
    cost: "",
    numOfTickets: "",
    date: "",
    time: "",
    location: "",
    eventId: "",
  });

  const router = useRouter(); // Initialize useRouter hook

  const saveEventToDatabase = async (eventId: string) => {
    try {
      // Save the event to the database with the eventId
      const response = await fetch('/api/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formState, eventId }),
      });

      if (response.ok) {
        console.log("Event successfully saved to database.");

        // Notify the marketplace about the new event
        const marketplaceResponse = await fetch('/api/notify-marketplace', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formState, eventId }),
        });

        if (marketplaceResponse.ok) {
          console.log("Event successfully sent to marketplace.");
        } else {
          console.error("Failed to send event to marketplace.");
        }
      } else {
        console.error("Failed to save event to database.");
      }
    } catch (error) {
      console.error("Error saving event to database:", error);
    }
  };

  const interactWithContract = async () => {
    console.log("📡 Attempting to interact with contract...");

    if (!signer || !account) {
      console.log("❌ No signer or account detected.");
      return;
    }

    const iface = new Interface(abi);
    const functionName = 'createEvent';
    const params = [
      formState.name,
      formState.picture,
      formState.description,
      formState.cost,
      formState.numOfTickets,
      formState.date,
      formState.time,
      formState.location,
    ];

    let encodedData;
    try {
      encodedData = iface.encodeFunctionData(functionName, params);
      console.log("🔐 Encoded data:", encodedData);
    } catch (err) {
      console.error("❌ ABI encoding failed:", err);
      return;
    }

    try {
      const estimatedGas = await signer.estimateGas({
        to: '0xcc5661D1471e9e61B37Df5Ad5D2E1B2C5578c884',
        data: encodedData,
      });

      const feeData = await signer.getFeeData();
      const adjustedGasLimit = estimatedGas.add(ethers.BigNumber.from("10000")); // buffer

      const tx = await signer.sendTransaction({
        to: '0xcc5661D1471e9e61B37Df5Ad5D2E1B2C5578c884',
        data: encodedData,
        gasLimit: adjustedGasLimit,
        maxFeePerGas: feeData.maxFeePerGas?.add(ethers.BigNumber.from("1000000000")),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.add(ethers.BigNumber.from("1000000000")),
      });

      console.log("🚀 Transaction hash:", tx.hash);
      console.log("📬 Account interacting:", account);

      const receipt = await tx.wait();
      console.log("✅ Transaction confirmed:", receipt);

      // Create a contract instance to read totalOccasions
      const contract = new ethers.Contract(
        '0xcc5661D1471e9e61B37Df5Ad5D2E1B2C5578c884',
        abi,
        signer
      );

      // totalOccasions is called after the event is created
      const total = await contract.totalOccasions();
      const eventId = total.sub(1); // eventId = totalOccasions - 1
      console.log("📦 Event ID (from totalOccasions - 1):", eventId.toString());

      // Add the eventId to the formState before sending to database
      setFormState(prevState => ({
        ...prevState,
        eventId: eventId.toString(),
      }));

      // Save the event to the database, now including the eventId
      await saveEventToDatabase(eventId.toString());

      // Redirect to the marketplace after successful event creation
      router.push("/marketplace"); // Navigate to the marketplace page

    } catch (error: any) {
      console.error("❌ Error during transaction flow:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    // Interact with the smart contract
    await interactWithContract();
    console.log("Form Submitted:", formState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Container>
      <H1>Welcome to tokEv!</H1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="picture">Picture</Label>
          <Input type="text" id="picture" onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <Input type="text" id="description" onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="cost">Cost</Label>
          <Input type="number" id="cost" onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="numOfTickets">Number of Tickets</Label>
          <Input type="number" id="numOfTickets" onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="date">Date</Label>
          <Input type="date" id="date" onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="time">Time</Label>
          <Input type="time" id="time" onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="location">Location</Label>
          <Input type="text" id="location" onChange={handleChange} />
        </FormGroup>

        {account ? (
          <Button type="submit">Create</Button>
        ) : (
          <Button type="button" onClick={() => connectWallet()}>
            Connect Wallet
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default CreateForm;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 140px auto 40px;
`;

const Form = styled.form`
  max-width: 600px;
  width: 40%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 15px;
  text-align: left;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const H1 = styled.h1`
  position: relative;
  font-size: 2.875rem;
  font-weight: bold;
`;

