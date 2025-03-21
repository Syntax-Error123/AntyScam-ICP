import Logo from '../../assets/images/anty-scam-modern.svg';
import { Link } from 'react-router-dom';
import '../../styles/nav.css'
import { usePaymentHandler } from '../../utils/payment';
import CustomButton from './CustomButton';
import SearchBar from './SearchBar';
import {FaIdCard, FaEnvelopeOpenText, FaPiggyBank,} from 'react-icons/fa';
import Deposit from '../../assets/images/deposit.svg';
import MetaMask from '../../assets/images/meta-mask.svg';
import {useErrorStore, useStore} from "../../store";
import { useState, useEffect } from 'react';
import {connectWallet, checkStableCoinAdded} from '../../utils/WalletConnect';
import { FirebaseAuth } from '../../firebaseConfig';
import { Badge } from '@mui/joy';

export default function AppNav (){
        const [walletConnected, setWalletConnected] = useState(false);
        const {setUserData, userData, isLoggedIn, setWalletAddress, walletAddress} = useStore();
        const {setError} = useErrorStore();
        const { handleDeposit } = usePaymentHandler(); 

        const handleWalletConnect = async ()=>  {
            try{
                const wallet = await connectWallet();
                if (wallet.address){
                    setWalletConnected(true);
                    setWalletAddress(wallet.address);
                    setError(true, 'Success', 'Wallet is connected!', 'success');
                    const result = await checkStableCoinAdded();
                    if (result){
                        setError(true, 'Success', 'Stable coin added successfully!', 'success');
                    }else{
                        throw new Error("Failed to add stable coin!");
                    }
                }
            } catch(err){
                console.log('Error: ', err);
                setError(true, 'Error', err.code, 'fail');
            }  
        }

        useEffect(() => {
            const handleDisconnectWallet = ()=> {
                setWalletConnected(false);
                setWalletAddress(null);
            }

            const checkWalletConnection = async () => {
                if (!FirebaseAuth.auth.currentUser) {
                    await new Promise((resolve) => {
                        const unsubscribe = FirebaseAuth.auth.onAuthStateChanged((user) => {
                            if (user) {
                                unsubscribe();
                                resolve(user);
                            }
                        });
                    });
                }
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({ method: "eth_accounts" });
        
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                        setWalletConnected(true);
                        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/db/user/set_wallet?user=${FirebaseAuth.auth.currentUser?.uid}`,{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({address: walletAddress})
                        });
                        const data = await response.json();
                        setUserData(data.user);
                    } else {
                        handleDisconnectWallet();
                    }
                }
            };
        
            checkWalletConnection();
        }, [walletAddress]);

        return <div className="nav-body">
        <div className="logo">
            <a href='/'>
                <img src={Logo} alt="Not Found" title='AntyScam'/>
                <h2>AntyScam</h2>
            </a>
        </div>
            {!isLoggedIn && (
                <div className="nav-links end">
                    <a href="/">Home</a>
                    <Link to="/guide">User Guide</Link>
                    <Link to="/abt-us">About Us</Link>
                    <Link to="/how">Learn How?</Link>
                    <Link to="/career">Careers</Link>
                </div>
            )}
            {
                isLoggedIn && (
                        <div className='nav-links end'>
                            <div className='start-links'>
                                <Link to="/u-panel">Dashboard</Link>
                                <Link to="/guide">User Guide</Link>
                                <Link to="/abt-us">About Us</Link>
                                <Link to="/how">Learn How?</Link>
                                <Link to="/career">Careers</Link>
                            </div>
                            <div className='end-icons'>
                                <SearchBar/>
                                <Link className="wallet" to='/u-panel/wallet'>
                                    <Badge size='sm' badgeContent={0} showZero={false} sx={{boxShadow: 'none'}}>
                                        <FaPiggyBank size={22}/>
                                    </Badge>
                                </Link>
                                <Link to="/u-panel/updates">
                                    <Badge size='sm' badgeContent={0} showZero={false} sx={{boxShadow: 'none'}}>
                                        <FaEnvelopeOpenText size={22}/>
                                    </Badge>   
                                </Link>
                                <Link to="/u-panel/profile">
                                    <Badge size='sm' badgeContent={0} showZero={false} sx={{boxShadow: 'none'}}>
                                        <FaIdCard size={26}/>
                                    </Badge>
                                </Link>
                            </div>
                        </div>
                )
            }
        {!isLoggedIn && <CustomButton buttonText="Get Started" buttonLink="/sign-up" />}
        {isLoggedIn && (walletConnected? <CustomButton buttonText="Deposit" onClick={handleDeposit} showIcon={true} icon={Deposit}/> : <CustomButton buttonText="Connect Wallet" onClick={handleWalletConnect} showIcon={true} icon={MetaMask} iconSize={16}/>)}
    </div>;
};