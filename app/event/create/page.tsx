"use client";

import React from "react";
import styled from "styled-components";
import { PictureUpload } from "./components/pictureUpload";

const CreateForm = () => {
  return (
    <Container>
      <H1>Welcome to tokEv!</H1>
      <Form>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="picture">Picture</Label>
          <PictureUpload />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <Input type="text" id="description" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="cost">Cost</Label>
          <Input type="email" id="cost" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="numOfTickets">Number of Tickets</Label>
          <Input type="text" id="numOfTickets" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="date">Date</Label>
          <Input type="date" id="date" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="time">Time</Label>
          <Input type="time" id="time" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="location">Location</Label>
          <Input type="text" id="location" />
        </FormGroup>
        <FormGroup>
          <Button type="submit">Submit</Button>
        </FormGroup>
      </Form>
    </Container>
  );
};

export default CreateForm;

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

