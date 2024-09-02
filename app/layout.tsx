"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import StyledComponentsRegistry from "@/lib/register";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import styled from "styled-components";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const theme = {
  // your theme values
};

// export const metadata: Metadata = {
//   title: "tokEv",
//   description: "tokenization of events",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [account, setAccount] = useState<string | null>(null);

  return (
    <html lang="en">
      <Body className={inter.className}>
        <StyledComponentsRegistry>
          <Header account={account} setAccount={setAccount} />
          <ContentWrapper>{children}</ContentWrapper>
          <Footer />
        </StyledComponentsRegistry>
      </Body>
    </html>
  );
}

const Body = styled.body`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
`;
