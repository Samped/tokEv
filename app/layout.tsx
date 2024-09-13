"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import StyledComponentsRegistry from "@/lib/register";
import { Inter } from "next/font/google";
import styled from "styled-components";
import { WalletProvider } from "./hooks/WalletProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Body className={inter.className}>
        <StyledComponentsRegistry>
          <WalletProvider>
            {/* Removed account and setAccount, since Header will get it from context */}
            <Header />
            <ContentWrapper>{children}</ContentWrapper>
            <Footer />
          </WalletProvider>
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
  min-height: calc(100vh - 99px);
  flex-grow: 1;
`;
