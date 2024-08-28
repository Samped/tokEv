'use client'

import Header from "../components/header"
import Hero from "../components/Hero"
import { useEffect, useState} from 'react'

export default function Home() {

  const [account, setAccount] = useState<string | null>(null); 
  return (
    <main>
      <Header account={account} setAccount={setAccount} />
      <Hero />
    </main>
  );
}
