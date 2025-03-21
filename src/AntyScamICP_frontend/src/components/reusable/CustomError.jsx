import { Alert } from "@mui/joy";
import "../../styles/alert.css";
import { useErrorStore } from "../../store";
import { useStore } from "zustand";

export const ErrorHandler = ()=>{
    const error = useStore(useErrorStore,(state)=>state.error)
    return (error.show && <CustomError title={error.title}
                        showMessage={true}
                        message={error.message}
                        errorType={error.type}/>);
};

export default function CustomError({title, message, errorType='fail', showMessage=false}){
    const themeColor = errorType === "fail" ? '#ff5757' : errorType === "success" ? '#57ff57' : '#fff';

    return <div className="AlertContainer" 
        style={{
            position: 'fixed',
            top: '0',
            zIndex: 9999,
            maxWidth: '30vw',
            left: '50%',
            padding: '10px 20px',
            textOverflow: 'ellipsis',
            whiteSpace: 'wrap'
        }}
    >
        <Alert
            key={title}
            variant="soft"
            sx={{background: 'rgba(33, 33, 33, 1.0)', boxShadow: `${themeColor} 0px 0px 30px`,}}
        >
            <div style={{display: 'flex', flexDirection:'column'}}>
                <h4 style={{color: themeColor, margin:'0px'}}>{title}</h4>
                {showMessage && <p style={{color: '#a6a6a6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0}}>{message}</p>}
            </div>
        </Alert>
    </div>;
}