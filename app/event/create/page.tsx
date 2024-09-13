"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Interface } from 'ethers'; 
import abi from '../../src/abi/eventTicketing.json'; 
import { PictureUpload } from "./components/pictureUpload";
import { useWallet } from "@/app/hooks/useWallet";

const CreateForm = () => {
  const { account, connectWallet, walletClient } = useWallet();
  const [formState, setFormState] = useState({
    name: "",
    picture: "",
    description: "",
    cost: "",
    numOfTickets: "",
    date: "",
    time: "",
    location: "",
  });


  // Function to interact with the smart contract
  const interactWithContract = async () => {
    if (!walletClient || !account) return;

    const iface = new Interface(abi);

    // Encode function data for the write operation
    const functionName = 'createEvent'; // Replace with your actual function name
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
    const encodedData = iface.encodeFunctionData(functionName, params);
    const hexEncodedData = `0x${encodedData.replace(/^0x/, '')}`;

    // Create the transaction
    try {
      const txHash = await walletClient.sendTransaction({
        account: account as `0x${string}`, // Ensure account is in correct format
        to: '0x3dE7a4C348F7415087a9Cf58FBC57256bAF1eb4b', 
        data: hexEncodedData as `0x${string}`,
        gas: BigInt(4000000),
      });

      console.log(`Transaction hash: ${txHash}`);
      
      // Poll for transaction receipt
      const receipt = await waitForTransactionReceipt(txHash);
      console.log(`Transaction confirmed with receipt:`, receipt);

      // If the transaction is successful, send the event data to MongoDB
      await saveEventToDatabase();
    } catch (error) {
      console.error("Error interacting with contract:", error);
    }
  };


  const saveEventToDatabase = async () => {
    try {
      // Save the event to the database
      const response = await fetch('/api/create-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
  
      if (response.ok) {
        console.log("Event successfully saved to database.");
  
        // Notify the marketplace about the new event
        const marketplaceResponse = await fetch('/api/notify-marketplace', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formState),
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


  // Function to wait for transaction receipt
  const waitForTransactionReceipt = async (txHash: string, interval = 1000, maxRetries = 60) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch('https://enugu-rpc.assetchain.org/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getTransactionReceipt",
            params: [txHash],
            id: 1,
          }),
        });

        const data = await response.json();
        const receipt = data.result;
        if (receipt) {
          return receipt;
        }
      } catch (error) {
        console.error(`Error fetching receipt: ${error}`);
      }
      await new Promise(resolve => setTimeout(resolve, interval)); // Wait before retrying
    }
    throw new Error(`Transaction receipt not found after ${maxRetries} retries.`);
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
          <Label htmlFor="picture">picture</Label>

          <PictureUpload/>
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
          <Button type="submit">Submit</Button>
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

