'use client'

declare const window: any

import { useEffect, useState} from 'react'
import { ethers } from 'ethers'
import Web3 from 'web3'


// ABi
import eventTicketing from '../src/abi/eventTicketing.json'

// Config
import config from '../src/config.json'


export default function events() {

    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [account, setAccount] = useState<string | null>(null); 

    const loadBlockchainData = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const address = config[31337].eventTicketing.address
  
        const eventfunc = new ethers.Contract(
            address,
            eventTicketing,
            provider
        )

        console.log(eventfunc)

        //Refresh Account
        window.ethereum.on('accountsChanged', async () => {
            window.ethereum.request({ method: 'eth_requestAccounts'})
            const web3instance = new Web3(window.ethereum)
            const accounts = await web3instance.eth.getAccounts()
            setAccount(accounts[0])
        })
    }
    useEffect(() => {
        loadBlockchainData()
    }, [])
    
    return (
        <main>
            <h2>events</h2>
            <p>{account}</p>
        </main>
    )
}