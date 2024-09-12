"use client";
import EventCard from "@/components/eventCard";
import Image, { StaticImageData } from "next/image";
import React, { FC } from "react";
import styled from "styled-components";
import image1 from "../../public/image2.jpg";
import profileImg from "../../public/image3.jpg";
import telegram from "../../public/telegram2.png";
import facebook from "../../public/facebook2.png";
import discord from "../../public/discord2.png";

const items = [
  {
    id: 1,
    title: "Product 1",
    description: "This is a great product.",
    image: image1,
  },
  {
    id: 2,
    title: "Product 2",
    description: "This is another great product.",
    image: image1,
  },
  {
    id: 3,
    title: "Product 1",
    description: "This is a great product.",
    image: image1,
  },
];

// EventCard component interface
interface EventProps {
  image: StaticImageData;
  title: string;
  description: string;
}

// UserProfile component interface
interface UserProfileProps {
  name: string;
  email: string;
  phone: string;
  profileImage: StaticImageData;
  createdEvents: EventProps[];
  joinedEvents: EventProps[];
}

// UserProfile component to show user info and events
const UserProfile: FC<UserProfileProps> = ({
  name,
  email,
  phone,
  createdEvents,
  joinedEvents,
}) => {
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileImage>
          <Image src={profileImg} alt={name} />
        </ProfileImage>
        <ContentWrapper>
          <ContactInfo>
            <h2>Sarah Tampers</h2>
            <p>Address: n2i7WfMR1Se7wofBz5jZqAJWymnWDjUXfY</p>
            <p>Email: user@gmail.com</p>
            <p>Phone: +234819932889</p>
          </ContactInfo>
          <SocialMediaWrapper>
            <Image src={telegram} alt="Telegram" width={25} height={25} />
            <Image src={facebook} alt="Facebook" width={25} height={25} />
            <Image src={discord} alt="Discord" width={32} height={32} />
          </SocialMediaWrapper>
        </ContentWrapper>
      </ProfileHeader>

      <Section>
        <h3>Events Created</h3>
        <EventGrid>
          {items.map((event, index) => (
            <EventCard
              key={index}
              image={event.image}
              title={event.title}
              description={event.description}
            />
          ))}
        </EventGrid>
      </Section>

      <Section>
        <h3>Events Joined</h3>
        <EventGrid>
          {items.map((event, index) => (
            <EventCard
              key={index}
              image={event.image}
              title={event.title}
              description={event.description}
            />
          ))}
        </EventGrid>
      </Section>
    </ProfileContainer>
  );
};

export default UserProfile;

// Styled components
const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 20px 60px;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 10px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContactInfo = styled.div`
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }

  p {
    margin: 5px 0;
    color: #666;
  }
`;

const Section = styled.section`
  margin-bottom: 2.5rem;

  h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    color: #333;
  }
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const SocialMediaWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 35px;

  & > img {
    cursor: pointer;
  }
`;
