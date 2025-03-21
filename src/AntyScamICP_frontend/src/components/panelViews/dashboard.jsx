import { useErrorStore, useStore } from "../../store";
import { useEffect, useState } from "react";
import Card from "../reusable/Card";
import CustomButton from "../reusable/CustomButton";
import { FaClipboardList, FaEllipsisV, FaExclamationTriangle, FaIdCard } from "react-icons/fa";
import {useCountUp} from "use-count-up";
import { LinearProgress } from "@mui/joy";
import { getBalance, disconnectWallet } from "../../utils/WalletConnect";
import { usePaymentHandler } from "../../utils/payment";
import CustomDialog from "../reusable/CustomDialog";
import "../../styles/signup.css";
import { CustomLoader } from "../reusable/CustomLoader";
import { FirebaseAuth } from "../../firebaseConfig";

export default function DashView(){
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cardExpand, setCardExpand] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0.0);
    const [unlockedBalance, setUnLockedBalance] = useState(0.0);
    const [lockedBalance, setLockedBalance] = useState(0.0);
    const [friends, setFriends] = useState([]);
    const {userData, setUserData, focusInput, walletAddress, setWalletAddress, setSelectedPanelOption, preferences} = useStore();
    const {setError} = useErrorStore();
    const { handleDeposit, handleWithdraw } = usePaymentHandler();
    const {value} = useCountUp({
        duration: 0.3,
        start: 0,
        isCounting: true,
        end: userData?.reputationScore*10,
        easing: 'linear'
    });

    const walletDisconnect = ()=>{
        disconnectWallet();
        setWalletAddress(null);
    }

    const handleVerification = async ()=> {
        try{
        const first_name = document.getElementById('f_name_field').value;
        const last_name = document.getElementById('l_name_field').value;

        setIsLoading(true); 

        if (!first_name || !last_name){
            setError(true, 'Failure', 'All fields are required', 'fail');
            setIsLoading(false);
            return;
        }
        const user = FirebaseAuth.auth.currentUser.uid;
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verify/create_request?user=${user}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name,
                last_name,
            })
        });
        if (!response.ok){
            setError(true, 'Error', "Verification failed", 'fail');
            setIsLoading(false);
            return;
        }
        const data = await response.json();
        setUserData(data.user);
        } catch (err){
            setError(true, 'Error', err.message, 'fail');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    

    const handleFileUpload = async () =>{
        try{
            setIsLoading(true);
            const fileInput = document.getElementById("file");
            const file = fileInput.files[0];

            if (!file){
                setError(true, 'Error', "Invalid Document", 'fail');
                setIsLoading(false);
                return;
            }

            if (file.size > 1024 * 1024){
                setError(true, 'Error', "File size exceeded", "fail");
                setIsLoading(false);
                return;
            }

            const validFormats = ['image/jpg', 'image/jpeg', 'image/png'];
            if (!validFormats.includes(file.type)){
                setError(true, 'Error', "Invalid file type", "fail");
                setIsLoading(false);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () =>{
                const base64file = reader.result.split(',')[1];
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/verify/upload?applicantId=${userData?.applicantId}`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        file: base64file,
                        fileType: file.type,
                        fileName: file.name,
                    })
                });
                const data = await response.json();
                if (!response.ok){
                    setError(true,'Error', data.error, 'fail');
                    setIsLoading(false);
                    return;
                }
                setError(true, 'Success', data.message, 'success');
            };
            reader.readAsDataURL(file);
        }catch (err){
            setIsLoading(false);
            setError(true, 'Error', err.message, 'fail');
        } finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        const fetchBalance = async () => {
            setIsLoading(true);
            if (walletAddress) {
                const balance = await getBalance(walletAddress);
                setWalletBalance(balance);
            }
            setIsLoading(false);
        };
        const fetchFriends = async () =>{
            setIsLoading(true);
            if (userData.friends){
                try{
                    const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/misc/friend/get_friends`,{
                        method: 'POST',
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify({
                            friends: userData.friends,
                        })
                    });
                    if (!result.ok) {throw new Error('Error fetching friends!');}
                    const data = await result.json();
                    setFriends(data.friends);
                } catch(err){
                    setError(true, 'Error', err.message, 'fail');
                }
            }
            setIsLoading(false);
        };
        fetchBalance(); 
        fetchFriends();
    },[walletAddress]);

    return (<>
        {isLoading && <CustomLoader/>}
        <CustomDialog open={open} setOpen={setOpen} title={'KYC Verification'} positionChildren="center">
            <div style={{flexDirection: 'column'}}>
                {userData?.verified === 'pending' ? <><div className="fields">
                    <input style={{maxWidth: 'minContent', alignSelf: 'center'}} id="f_name_field" type="text" placeholder="First Name"/>
                    <input style={{maxWidth: 'minContent', alignSelf: 'center'}} id="l_name_field" type="text" placeholder="Last Name"/>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                    <CustomButton onClick={handleVerification} buttonText={'Proceed'} style={{maxWidth: 'min-content'}}/>
                </div>
                <p style={{color: 'var(--col-prim-gray) ', maxWidth: '300px', fontSize: '0.9em'}}><span style={{fontWeight: 'bold'}}>Note: </span>
                Your details are required for your legal verification, so that you can fully access the platform.
                Please don't share any false information or it will result in the immediate rejection of your verification request.</p></>: userData?.verified === 'doc_submitted' ? <>
                    <h2 style={{color: 'var(--col-amb-red)'}}>Verification Request Submitted!</h2>
                    <p style={{color: 'var(--col-prim-gray) ', maxWidth: '250px', fontSize: '0.9em'}}><span style={{fontWeight: 'bold'}}>Note: </span>
                    Kindly wait while we verify your details.</p>
                </> : <>
                    <h2 style={{color: 'var(--col-amb-red)'}}>Document Upload</h2>
                    <form style={{width: 'fit-content', height: 'fit-content', display: 'flex', padding: '20px 40px', alignItems: 'center', justifyContent: 'center', background: 'transparent'}}>
                        <label htmlFor="file" style={{
                            cursor: 'pointer',
                            background: 'var(--col-body-black)', 
                            padding: '20px 80px', 
                            borderRadius: '16px', 
                            border: '2px dashed var(--col-amb-red)', 
                            color: 'var(--col-prim-gray)',
                            boxShadow: '0px 0px 200px -50px rgba(0,0,0,0.5)'}}>    
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 5,
                            }}>
                                <FaIdCard size={120}/>
                                <h4>National Id</h4>
                                <p style={{color: 'var(--col-milky-white)', textAlign: 'center', margin: 0}}>Make sure that the image is clear and has sufficient background lightning</p>
                            </div>
                            <input onChange={handleFileUpload} style={{display: 'none'}} id="file" type="file" />
                        </label>    
                    </form>
                </>}
            </div>
        </CustomDialog>
        <h1>Welcome <span style={{color: 'var(--col-amb-red)'}}>{userData?.username ?? 'Guest'},</span></h1>
                <div className="mainRow" style={{display: 'flex', flexDirection: 'row', gap: 14}}>
                    <Card sx={{height: 'fit-content', boxShadow: 'none', flex: 7, borderRadius: 20}} showImage={false}>
                        <h3 style={{color: '#fff', marginBottom: 0, marginTop: 0}}>Wallet Balance</h3>
                        <div className="card-row-1" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
                            <h1 style={{color: '#fff', marginBlockStart: '0.3em', marginBlockEnd: '0.4em'}}>{Number(walletBalance).toFixed(2)} <span style={{color: 'var(--col-amb-red)'}}>{preferences?.currency}</span></h1>
                            <FaEllipsisV title="Get more info" onClick={()=>setCardExpand(!cardExpand)} style={{color: `${cardExpand ? 'var(--col-amb-red)' : '#fff'}`, cursor: 'pointer'}}/>
                        </div>
                        {cardExpand && <div className="card-row-2" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%',}}>
                            <h4 style={{marginTop: 0, color: 'var(--col-prim-gray)'}}>Locked Funds: {lockedBalance.toFixed(2)}<br/>Unlocked Funds: {unlockedBalance.toFixed(2)}</h4>
                        </div>}
                        <div className="card-row-3" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
                            <div className="action-btns" style={{display: 'flex', flexFlow: 'row', gap: 10,}}>
                                <CustomButton btnStyle={{backgroundColor: 'transparent', color: 'var(--col-amb-red)'}} buttonText={'Withdraw'} onClick={handleWithdraw}/>
                                <CustomButton btnStyle={{backgroundColor: 'transparent', color: 'var(--col-amb-red)'}} buttonText={'Deposit'} onClick={handleDeposit}/>
                            </div>
                            {
                                walletAddress ? (<div className="walletInfo" style={{display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center'}}>
                                    <h3 style={{color: 'var(--col-milky-white)', letterSpacing: '0.1em', marginBottom: 0, marginTop: 0}}>{`${String(walletAddress).substring(0,9)}...`}</h3>
                                    <CustomButton onClick={walletDisconnect} buttonText={'Disconnect'}/>
                                </div>) : <h3 style={{color: 'var(--col-milky-white)', letterSpacing: '0.1em', marginBottom: 0, marginTop: 0}}>Wallet not connected</h3>
                            }
                        </div>
                    </Card>
                    <Card sx={{ borderRadius: 20, height: 'unset', boxShadow: 'none', background: 'none', outline: '3px var(--col-amb-red) dashed', alignItems: 'center', flex: 3, justifyContent: `${userData?.friends.length > 0 ? 'flex-start' : 'center'}`}} showImage={false}>
                        {
                            userData?.friends.length > 0 ? (
                                <>
                                    <h3 style={{color: 'var(--col-amb-red)', marginTop: 0,}}>Friends</h3>
                                    <div style={{overflow: 'scroll', display: 'flex', gap: 10, width: '100%', flexDirection: 'column', height: '70px', scrollbarWidth: 'none'}}>
                                        {friends.map((friend, index)=>(
                                          <div key={friend.id} style={{background: 'var(--col-prim-gray)', borderRadius: '8px', padding: '4px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <h3 style={{margin: 0}}><span>{index+1}.</span> {friend.username}</h3>
                                            <FaEllipsisV cursor={'pointer'}/>
                                          </div>  
                                        ))}
                                    </div>
                                </>
                            )  : (
                                <div style={{display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <h3 style={{color: 'var(--col-prim-gray)', textAlign: 'center', width: '50%', alignSelf: 'center', marginTop: 0, marginBottom: 0}}>Connect with friends to see them here</h3>
                                    <CustomButton onClick={focusInput} style={{flex: 'none'}} buttonText={'Connect'}/>
                                </div>
                            )

                        }
                    </Card>
                </div>
                <div className="infoCards" style={{display: 'flex', flexDirection: 'row', gap: 12}}>
                    <Card sx={{height: 'fit-content', boxShadow: 'none', alignItems: 'flexStart',  borderRadius: 20}} showImage={false}>
                        <h3 style={{color: 'var(--col-amb-red)', marginTop: 0, alignSelf: 'center'}}>Trade Info</h3>
                        <p style={{margin: 0, color: 'var(--col-milky-white)'}}>Total Disputes: {userData?.disputes}</p>
                        <p style={{margin: 0, color: 'var(--col-milky-white)'}}>Active Trades: {userData?.pendingTrades}</p>
                        <p style={{margin: 0, color: 'var(--col-milky-white)'}}>Completed Trades: {userData?.completedTrades}</p>
                    </Card>
                    <Card sx={{height: 'unset', boxShadow: 'none', alignItems: 'flexStart',  borderRadius: 20}} showImage={false}>
                        <h3 style={{color: 'var(--col-amb-red)', marginTop: 0, alignSelf: 'center'}}>Reputation</h3>
                        <p style={{margin: 0, color: 'var(--col-milky-white)', marginBottom: '10px'}}><FaClipboardList style={{marginRight: '5px'}}/>Score</p>
                        <div style={{display: 'flex', flexDirection: 'row', width: '100%', gap: 10}}>
                            <LinearProgress value={Number(value)} determinate variant="soft" size="lg" sx={{color: 'var(--col-amb-red)', backgroundColor: 'var(--col-milky-white)', flex: 9, alignSelf: 'center'}}/>
                            <p style={{flex: 1, margin: 0, color: 'var(--col-milky-white)',}}>{userData?.reputationScore}/10</p>
                        </div>
                    </Card>
                    {!userData?.verified === 'complete' && <Card sx={{height: 'unset', boxShadow: 'none', alignItems: 'center', justifyContent: 'center', background: 'var(--col-amb-red)',  borderRadius: 20}} showImage={false}>
                        {(userData?.verified === 'pending' || userData?.verified === 'in_process' || userData?.verified === 'doc_submitted') && (
                            <>
                                <h4 style={{textAlign: 'center', color: 'var(--col-body-black)', marginBottom: '8px', fontWeight: 'lighter'}}><span style={{marginRight: 5, alignSelf: 'center'}}><FaExclamationTriangle/></span>You need to verify you account to unlock full access to the platform</h4>
                                <CustomButton onClick={()=>setOpen(true)} style={{scale: '0.8',}} btnStyle={{background: 'var(--col-overlay-black)', outlineColor: 'var(--col-overlay-black)', color: 'var(--col-amb-red)',  boxShadow: '2px 2px var(--col-prim-gray) inset'}} buttonText={'Verify Now'}/>
                            </>
                        )}
                    </Card>}
                </div>
                <div className="past-txs" style={{display: 'flex', marginTop: 0, flexDirection: 'column', flexGrow: 1}}>
                    <h2 style={{color: '#fff'}}>Past Trades</h2>
                    {
                       userData?.transactions.length > 0 ? (
                            <>
                            </>
                       ) : <div style={{display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 10}}>
                            <h2 style={{color: 'var(--col-prim-gray)', marginTop: 0, marginBottom: 0}}>No trades yet</h2>
                            <CustomButton onClick={()=>setSelectedPanelOption('createReq')} style={{flex: 'none',}} btnStyle={{backgroundColor: 'transparent', color: 'var(--col-amb-red)',}} buttonText={'Start a trade'}/>
                       </div>
                    }
                </div>
    </>);
}