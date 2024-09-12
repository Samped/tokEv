"use client";

import Image from "next/image";
import tokEv2 from "../public/tokEv2.png";
import Link from "next/link";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import Web3 from "web3";
import styled from "styled-components";
import { usePathname, useRouter } from "next/navigation";

declare const window: any;

interface NavBarProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const Header: React.FC<NavBarProps> = ({ account, setAccount }) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const marketPlaceUrl = "/marketplace";

  const connectHandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      window.ethereum.request({ method: "eth_requestAccounts" });
      const web3instance = new Web3(window.ethereum);
      const accounts = await web3instance.eth.getAccounts();
      setAccount(accounts[0]);
    }
  };

  return (
    <Wrapper>
      <Link href="/">
        <LogoContainer>
          <LogoWrapper>
            <Image src={tokEv2} height={40} width={40} alt="tokev logo" />
          </LogoWrapper>
          <LogoText>tokEv</LogoText>
        </LogoContainer>
      </Link>
      {pathname === marketPlaceUrl && (
        <SearchBar>
          <SearchIcon>
            <AiOutlineSearch />
          </SearchIcon>
          <SearchInput placeholder="Search events and accounts" />
        </SearchBar>
      )}

      <HeaderItems>
        {account ? (
          <WalletAddress onClick={() => push("/dashboard")}>
            <HeaderIcon>
              <CgProfile />
            </HeaderIcon>
            {account?.slice(0, 6) + "..." + account?.slice(38, 42)}
          </WalletAddress>
        ) : (
          <HeaderIcon onClick={connectHandler}>
            <MdOutlineAccountBalanceWallet />
            <WalletConnect>Connect</WalletConnect>
          </HeaderIcon>
        )}
        <Button onClick={() => push("/event/create")}>Create Event</Button>
      </HeaderItems>
    </Wrapper>
  );
};

export default Header;

// Styled Components
const Wrapper = styled.div`
  background-color: #04111d;
  width: 100vw;
  padding: 0.8rem 1.2rem;
  display: flex;
  position: fixed;
  top: 0;
  z-index: 50;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoText = styled.div`
  margin-left: 0.4rem;
  color: white;
  font-weight: 600;
  font-size: 1.6rem;
`;

const SearchBar = styled.div`
  display: flex;
  flex: 1;
  margin: 0 0.8rem;
  max-width: 520px;
  align-items: center;
  background-color: #363840;
  border-radius: 0.8rem;
  &:hover {
    background-color: #4c505c;
  }
`;

const SearchIcon = styled.div`
  color: #8a939b;
  margin: 0 12px;
  font-weight: bold;
  font-size: 1.125rem;
`;

const SearchInput = styled.input`
  height: 2.6rem;
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  padding: 0 0.5rem;
  color: #e6e8eb;
  &::placeholder {
    color: #8a939b;
  }
`;

const HeaderItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
`;

const HeaderIcon = styled.button`
  color: #8a939b;
  font-size: 3rem;
  font-weight: bold;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: none;
  border: none;

  & > svg {
    width: 35px;
    height: 35px;
  }

  &:hover {
    color: white;
  }
`;

const WalletConnect = styled.span`
  margin-left: 0.5rem;
  font-size: 1.3rem;
  font-weight: bold;
`;

const WalletAddress = styled.button`
  display: flex;
  align-items: center;
  color: white;
  font-size: 1rem;
  background: none;
  border: none;
  font-weight: 500;
  margin-left: 0.8rem;
`;

const LogoWrapper = styled.div`
  width: 40px;
  height: 40px;
  overflow: hidden;

  & > img {
    transform: scale(2);
    margin-top: 4px;
  }
`;

const Button = styled.button`
  position: relative;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.75rem 2.2rem;
  background-color: #2181e2;
  border-radius: 0.5rem;
  margin-right: 1.25rem;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #42a0ff;
  }
`;
