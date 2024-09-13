

interface Window {
    ethereum: {
      isMetaMask?: boolean;
      request: (...args: any[]) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
    };
  }



  