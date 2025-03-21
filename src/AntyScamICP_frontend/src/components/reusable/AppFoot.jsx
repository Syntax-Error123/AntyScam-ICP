import { Link } from "react-router-dom";
import "../../styles/foot.css";
import { FaGithub, FaReddit, FaTwitter, FaTelegram, FaLinkedin, FaDiscord } from "react-icons/fa";
export default function AppFoot(){
    return <div className="foot-body">
        <div className="newsletter">
            <p>Subscribe to our newsletter!</p>
            <input type="text" autoComplete="off" placeholder="Your email"></input>
        </div>
        <div className="links">
            <Link to="/abt-us"><p>About Us</p></Link>
            <Link to="/career"><p>Join Us</p></Link>
            <Link to="/"><p>User Compliance</p></Link>
            <Link to="/"><p>Terms & Conditions</p></Link>
            <Link to="/"><p>Privacy Policy</p></Link>
            <Link to="/"><p>Security</p></Link>
            <Link to="/"><p>Status</p></Link>
        </div>
        <div className="socials">
            <a href="https://github.com/GeekyHichambel/AntyScam" className="social-icon"><FaGithub/></a>
            <a href="/" className="social-icon"><FaReddit/></a>
            <a href="/" className="social-icon"><FaTwitter/></a>
            <a href="/" className="social-icon"><FaTelegram/></a>
            <a href="/" className="social-icon"><FaLinkedin/></a>
            <a href="/" className="social-icon"><FaDiscord/></a>
        </div>
        <div className="copyright">© 2025 <span>AntyScam</span>. All rights reserved.</div>
    </div>;
};