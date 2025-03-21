import AppNav from "../components/reusable/AppNav";
import {Link} from "react-router-dom";
import { List, listClasses, ListDivider, ListItem, ListItemButton, listItemClasses, ListItemDecorator} from "@mui/joy";
import { FaHome, FaCoins, FaCog, FaPiggyBank, FaPlusCircle, FaHistory} from "react-icons/fa";
import { useStore, useErrorStore } from "../store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listItemButtonClasses } from "@mui/joy/ListItemButton";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import Arrow from "../assets/images/arrow.svg";
import "../styles/panel.css";
import CustomButton from "../components/reusable/CustomButton";
import CustomDialog from "../components/reusable/CustomDialog";
import { FirebaseAuth } from "../firebaseConfig";
import DashView from "../components/panelViews/dashboard";
import TradeView from "../components/panelViews/tradeCenter";
import TxsView from "../components/panelViews/transactions";
import WalletView from "../components/panelViews/wallet";
import SettingsView from "../components/panelViews/settings";
import CreateReqView from "../components/panelViews/createTrade";

const theme =  extendTheme({
    components: {
      JoyList: {
        styleOverrides: {
            root: {
                [`&.${listClasses.root}`] :{
                    paddingBlock: 0,
                    gap: '10px',
                },                
            }
        }
      },
      JoyListItem: {
        styleOverrides: {
            root: {
                [`&.${listItemClasses.root}`] :{
                    paddingLeft: '40px',
                },
                [`&.${listItemClasses.nested}`]: {
                    paddingLeft: '10px',
                },
            }
        }
      },
      JoyListItemButton: {
        styleOverrides: {
          root: {
            [`&.${listItemButtonClasses.root}`]: {
                borderRadius:'4px',
                color:'#cec7bf',
                padding: '8px 8px',
                justifyContent: 'flex-start',
            },
            [`&.${listItemButtonClasses.selected}`]: {
              color: '#ffffff',
              backgroundColor: '#ff5757',
            },
          },
        },
      },
    },
  });

export default function UserPanel(){
    const navigate = useNavigate();
    const {setError, } = useErrorStore();
    const [dialogOpen, setDialogOpen] = useState(false);
    const {setUserData, selectedPanelOption, isLoggedIn, setLoggedIn, setSelectedPanelOption} = useStore();
    

    const handleLogOut = async ()=>{
        try{
            await FirebaseAuth.signOut(FirebaseAuth.auth);
            setError(true, 'Alert', 'User logged out', 'default');
            setLoggedIn();
            setUserData(null);
        }catch(err){
            setError(true, 'Error', err.message, 'fail');
        }
    }

    useEffect(()=>{
        if (!isLoggedIn){
            navigate('/');
        }
    },[isLoggedIn]);

    return <CssVarsProvider theme={theme}>
    <div className="dash-body">
        <AppNav/>
        <div className="main">
            <div className="selectable-list" style={{display: 'flex', flexDirection: 'column', height: '80vh',}}>
                <List variant="outlined" sx={{flexGrow: 1, padding: '20px 10px', borderColor: '#a6a6a6', borderLeft: 'none', borderTop:'none', borderBottom: 'none'}}>
                    <ListItem>
                        <ListItemButton selected={selectedPanelOption === 'dashboard'} onClick={()=>setSelectedPanelOption('dashboard')}>
                            <ListItemDecorator>
                                <FaHome/>
                            </ListItemDecorator>
                            DashBoard
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton selected={selectedPanelOption === 'trades'} onClick={()=>setSelectedPanelOption('trades')}>
                            <ListItemDecorator>
                                <FaCoins/>
                            </ListItemDecorator>
                            Trade Center
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton selected={selectedPanelOption === 'txs'} onClick={()=>setSelectedPanelOption('txs')}>
                            <ListItemDecorator>
                                <FaHistory/>
                            </ListItemDecorator>
                            Transaction History
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton selected={selectedPanelOption === 'walletView'} onClick={()=>setSelectedPanelOption('walletView')}>
                            <ListItemDecorator>
                                <FaPiggyBank/>
                            </ListItemDecorator>
                            Wallet Overview
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton selected={selectedPanelOption === 'createReq'} onClick={()=>setSelectedPanelOption('createReq')}>
                            <ListItemDecorator>
                                <FaPlusCircle/>
                            </ListItemDecorator>
                            Create Request
                        </ListItemButton>
                    </ListItem>
                    <ListItem nested sx={{marginTop: 'auto', paddingLeft: '100px'}}>
                        <List>
                        <ListDivider inset={'startContent'}/>
                            <ListItem>
                                <ListItemButton selected={selectedPanelOption === 'settings'} onClick={()=>setSelectedPanelOption('settings')}>
                                    <ListItemDecorator>
                                        <FaCog/>
                                    </ListItemDecorator>
                                    Settings
                                </ListItemButton>
                            </ListItem>
                            <Link style={{textDecoration:'none',}}>
                                <ListItem>                    
                                    <CustomButton
                                        buttonText="Log Out"
                                        onClick={setDialogOpen}
                                        showIcon={true}
                                        icon={Arrow}
                                        iconSize={24}
                                    />
                                    <CustomDialog title={"Caution!"} description={"Are you sure you want to log out?"} open={dialogOpen}>
                                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 20}}>
                                            <CustomButton
                                            style={{flex: 'none'}}
                                            buttonText="Confirm"
                                            onClick={handleLogOut}
                                            />
                                            <CustomButton
                                            style={{flex: 'none'}}
                                            btnStyle={{backgroundColor: 'white', color: '#ff5757'}}
                                            buttonText="Cancel"
                                            onClick={()=>setDialogOpen(false)}
                                            />
                                        </div>
                                    </CustomDialog>
                                </ListItem>
                            </Link>
                        </List>
                    </ListItem>
                </List>
            </div>
            <div className="content" style={{display:'flex', gap: 10, flexDirection: 'column', overflowY: 'scroll', minHeight: '80vh', scrollbarWidth: 'none'}}>
                    {
                        selectedPanelOption === 'dashboard' && <DashView/>
                    }
                    {
                        selectedPanelOption === 'trades' && <TradeView/>
                    }
                    {
                        selectedPanelOption === 'txs' && <TxsView/>
                    }
                    {
                        selectedPanelOption === 'walletView' && <WalletView/>
                    }
                    {
                        selectedPanelOption === 'createReq' && <CreateReqView/>
                    }
                    {
                        selectedPanelOption ==='settings' && <SettingsView/>
                    }
                </div>
            </div>
        </div>
    </CssVarsProvider>;
};