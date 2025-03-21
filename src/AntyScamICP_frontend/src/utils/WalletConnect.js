import { ethers } from 'ethers';

const checkStableCoinAdded = async () => {
  if (window.ethereum){
    const accounts = await window.ethereum.request({method: 'eth_accounts'});

    if (accounts.length > 0){
      const tokenAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: "ERC20",
          options: {
            address: process.env.REACT_APP_STABLE_COIN_ADDRESS,
            symbol: "ASCX",
            decimals: 18,
          }
        }
      });
      if (tokenAdded) {
        return true;
      }
      return false;
    }
  }
}

const connectWallet = async () => {
     if (window.ethereum){
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        return {signer, address};
    }else{
        alert('Please install Metamask or enable it in your browser');
        return null;
    }
};

const disconnectWallet = async ()=>{
    if (window.ethereum){
        await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
    }
}

const getBalance = async (wallet_add) => {
  if (window.ethereum){
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi_json = await fetch('/StableCoin.json');
      const TOKEN_ABI = await abi_json.json();
      const contract = new ethers.Contract(process.env.REACT_APP_STABLE_COIN_ADDRESS, TOKEN_ABI.abi, provider);

      const balance = await contract.balanceOf(wallet_add);
      const formmated_balance = ethers.formatUnits(balance, 20);
      return formmated_balance;
  }
}

export { connectWallet, disconnectWallet, checkStableCoinAdded, getBalance };