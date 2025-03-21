import "../styles/features.css";
import Card from "./reusable/Card";
import ZeroRisk from "../assets/images/zero-risk.svg";
import Trust from "../assets/images/trust.svg";
import InOut from "../assets/images/in-out.svg";
export default function Features(){
    return <div className="feature-container">
        <div className="tube-light">
            <div className="tube"></div>
            <div className="light"></div>
        </div>
        <div className="cards">
            <Card title="Zero Risk Trades" description="Eliminate scams with Smart Contracts that remove middlemen and ensure secure, risk-free trades." image={ZeroRisk}/>
            <Card title="Trust Even Strangers" description="Leverage blockchain technology to decentralize control and build trust, even with strangers." image={Trust}/>
            <Card title="Swift In & Out" description="Enjoy a seamless experience with fast onboarding and instant cashouts, thanks to a user-friendly design." image={InOut}/>
        </div>
    </div>;
}