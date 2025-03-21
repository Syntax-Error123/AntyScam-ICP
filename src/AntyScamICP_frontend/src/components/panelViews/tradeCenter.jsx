import { useState, useEffect } from "react";
import { FaEllipsisH, } from "react-icons/fa";
import { useStore } from "../../store";

export default function TradeView(){
    const [active, setActive] = useState(false);
    const [timer, setTimer] = useState([0,0]);
    const {userData} = useStore();

    // useEffect(()=>{
    //     const interval = setInterval(()=>{
    //         fetch(`${process.env.REACT_APP_BACKEND_URL}/api/misc/status/checkStatus/${userData.username}`)
    //             .then(res=>res.json())
    //             .then(data=>setActive(data.online));
    //     }, 10000);
    //     return () => clearInterval(interval);
    // }, [active]);

    useEffect(() => {
        if (timer[0] === 0 && timer[1] === 0) return;
        const interval = setInterval(() => {
            setTimer(([minutes, seconds]) => {
                if (seconds === 0) {
                    if (minutes === 0){
                        clearInterval(interval);
                        return [0,0];
                    }
                    return [minutes - 1, 59];
                } else{
                    return [minutes, seconds - 1];
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div style={styles.wrapper}>
            <div style={styles.activeWindowContainer}>
                <div style={styles.topBorder}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <h3 style={{marginRight: '10px'}}>Anonymous</h3>
                        <div style={{background: `${!active ? 'var(--col-overlay-black)' : '#22ff88'}`, width: '16px', height: '16px', borderRadius: '50%'}}></div>
                    </div>
                    <div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bolder', color: 'var(--col-amb-red)', alignItems: 'center'}}>
                        <h2 title="Trade Ends in: 0 sec">{timer[0].toString().padStart(2, '0') + ":" + timer[1].toString().padStart(2, '0')}</h2>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <FaEllipsisH size={20} cursor={'pointer'}/>
                    </div>
                </div>
                <div style={styles.activeWindow}>
                    <h3>No Active Trades Yet!</h3>
                </div>
            </div>
            <div style={styles.history}>
                <h2>Trades</h2>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        padding: "10px",
    },
    activeWindowContainer: {
        display: "flex",
        flexDirection: "column",
        flex: 7,
        marginRight: "50px",
        borderRadius: '20px',
        boxShadow: "0px 2px 3px var(--col-prim-gray), 0px 0px 6px 6px var(--col-body-black) inset",
    },
    topBorder: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        height: "60px",
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--col-milky-white)',
        padding: '2px 36px',
        backgroundColor: "rgba(0,0,0,0.85)",
        borderRadius: "20px 20px 0 0",
    },
    activeWindow: {
        backgroundColor: 'rgba(166,166,166,0.05)',
        display: "flex",
        padding: '30px',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderColor: "rgba(0,0,0,0.85)",
        borderStyle: 'solid',
        borderWidth: "2px 2px",
        borderRadius: '0 0 20px 20px',
        color: "var(--col-milky-white)",
        overflowY: 'auto',
    },
    history: {
        display: "flex",
        flex: 3,
        color: '#fff',
    }
};