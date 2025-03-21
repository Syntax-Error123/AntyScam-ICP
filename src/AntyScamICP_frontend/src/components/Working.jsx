import "../styles/working.css";
import FlowChart from "../assets/images/working.svg";
import Arrow from "../assets/images/arrow.svg";
import CustomButton from "./reusable/CustomButton";
export default function Working(){
    return <div className="working-container">
        <h1>How it Works</h1>
        <div className="wrapper">
            <div className="left-sec">
                <img src={FlowChart} alt="Not Found!"/>
            </div>
            <div className="right-sec">
                <p>Our platform enables secure and transparent peer-to-peer trading. Users can easily sign up, create profiles, and connect their wallets. Smart contracts automate trades, ensuring safe and efficient fund transfers between users.</p>
                <CustomButton 
                    className="nav-btn"
                    buttonLink='/how'
                    buttonText='Know More'
                    showIcon={true}
                    icon={Arrow}
                />
            </div>
        </div>
    </div>;
};