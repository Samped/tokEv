"use client";

import { ethers } from "ethers";
import Image from "next/image";
import tokEv2 from "../public/tokEv2.png";
import Link from "next/link";
import React from "react";
import logo from "../public/logo.png";
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { useEffect, useState } from "react";
import Web3 from "web3";
import styled from "styled-components";
import { usePathname } from "next/navigation";

declare const window: any;

const style = {
  wrapper: `bg-[#04111d] w-screen px-[1.2rem] py-[0.8rem] flex fixed top-0 z-50 justify-between`,
  logoContainer: `flex items-center cursor-pointer`,
  logoText: ` ml-[0.4rem] text-white font-semibold text-2xl`,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#4c505c]`,
  searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  headerItems: ` flex items-center justify-end`,
  headerItem: `text-white px-4 font-bold text-[#c8cacd] hover:text-white cursor-pointer`,
  headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer flex items-center`,
  walletconnect: `ml-[0.5rem] text-[#8a939b] font-bold text-2xl font-black hover:text-white`,
  walletaddress: `ml-[0.8rem] text-white font-medium text-base flex items-center`,
};

interface NavBarProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const Header: React.FC<NavBarProps> = ({ account, setAccount }) => {
  const pathname = usePathname();
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
    <div className={style.wrapper}>
      <Link href="/">
        <div className={style.logoContainer}>
          <LogoWrapper>
            <Image src={tokEv2} height={40} width={40} alt="tokev logo" />
          </LogoWrapper>
          <div className={style.logoText}>tokEv</div>
        </div>
      </Link>
      {pathname === marketPlaceUrl && (
        <div className={style.searchBar}>
          <div className={style.searchIcon}>
            <AiOutlineSearch />
          </div>
          <input
            className={style.searchInput}
            placeholder="search events and accounts"
          />
        </div>
      )}

      <div className={style.headerItems}>
        <div>
          {account ? (
            <button type="button" className={style.walletaddress}>
              <div className={style.headerIcon}>
                <CgProfile />
              </div>
              {account.slice(0, 6) + "..." + account.slice(38, 42)}
            </button>
          ) : (
            <button
              type="button"
              className={style.headerIcon}
              onClick={connectHandler}
            >
              <MdOutlineAccountBalanceWallet />
              <span className={style.walletconnect}>Connect</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

const LogoWrapper = styled.div`
  width: 40px;
  height: 40px;
  overflow: hidden;

  & > img {
    transform: scale(2);
    margin-top: 4px;
  }
`;
