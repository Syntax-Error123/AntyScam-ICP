import "../styles/signup.css";
import { useEffect, useState } from "react";
import CustomButton from "../components/reusable/CustomButton";
import Logo from "../assets/images/anty-scam-modern.svg";
import { CustomLoader } from "../components/reusable/CustomLoader";
import GoogleLogo from "../assets/images/google.png";
import { Link, useNavigate } from "react-router-dom";
import { useErrorStore, useStore } from "../store";
import {FirebaseAuth} from "../firebaseConfig";

export default function Signup(){
    const [isLoading, setIsLoading] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const {isLoggedIn, setLoggedIn, setUserData} = useStore();
    const {setError} = useErrorStore();
    const navigate = useNavigate();
    const handleFlip = ()=> {
        setFlipped(!flipped);
    };
    
    const handleLogin= async ()=>{
        const emailUsername = document.getElementById("ue_field").value;
        const password = document.getElementById("upass_field").value;

        setIsLoading(true); 

        if (!emailUsername || !password){
            setError(true, 'Failure', 'All fields are required', 'fail');
            setIsLoading(false);
            return;
        }

        try{
            let email = emailUsername;
            if (!email.includes("@")){
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/db/user/get_mail`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({username: email})
                });
                const data = await response.json();
                if (!response.ok){
                    throw new Error(data.error);
                }
                email = data.email;
            }
            const userCred = await FirebaseAuth.signInWithEmailAndPassword(FirebaseAuth.auth, email, password);
            const user = userCred.user;
            const idToken = await user.getIdToken();
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login_user`,{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({token: idToken})
            });
            const data = await response.json();
            if (!response.ok){
                throw new Error(data.error);
            }
            setUserData(data.user);
            setError(true, 'Success', 'User logged in successfully', 'success');
            setLoggedIn();
        } catch (err){
            setIsLoading(false);
            setError(true, "Error", err.message, "fail");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSignUp = async () =>{
        const email = document.getElementById("e_field").value;
        const password = document.getElementById("p_field").value;
        const confirmPassword = document.getElementById("cp_field").value;
        const username = document.getElementById("u_field").value;

        setIsLoading(true);

        if (!username || !email || !password || !confirmPassword){
            setError(true, "Error", "All fields are required", "fail");
            return;
        }
        if (password !== confirmPassword){
            setError(true, "Error", "Passwords do not match", "fail");
            return;
        }
        try{
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/create_user`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: username, email: email, password: password}),
            });
            const data = await response.json();
            if (!response.ok){
                throw new Error(data.error);
            }
            setError(true, "Success", data.message, "success");
            handleFlip();
        } catch (err){
            setIsLoading(false);
            setError(true, "Error", err.message, "fail");
        } finally {
            setIsLoading(false);
        }
    }

    const oAuthLogin = async () => {
        try {
            const result = await FirebaseAuth.signInWithPopup(FirebaseAuth.auth, FirebaseAuth.googleProvider);
            const token = await result.user.getIdToken();
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/oauth_login?token=${token}`);
            const data = await response.json();
            if (!response.ok){
                throw new Error(data.error);
            }
            setUserData(data.user);
            setError(true, "Success", data.message, "success");
            setLoggedIn();
        } catch (err) {
            setIsLoading(false);
            setError(true, "Error", err.message, "fail");
        } finally{
            setIsLoading(false);
        }
    };

    const FrontComponent = ()=> (
        <>
            <div className="form-left">
            <h1>Log In</h1>
            <div className="fields">
                    <input id="ue_field" type="text" placeholder="Username/Email"/>
                    <input id="upass_field" type="password" placeholder="Password"/>
            </div>  
            <div className="btn-row">
                <CustomButton buttonText="Log in" onClick={handleLogin}/>
                <Link className="switch-text" to="" onClick={handleFlip}>
                    <p>New Here?</p>
                </Link>
            </div>
            <Link className="forgot-text" to="">
                <p>Forgot Password?</p>
            </Link>
            <CustomButton onClick={oAuthLogin} className="g-btn" buttonText="Continue with Google" showIcon={true} icon={GoogleLogo} iconSize={20}/>
        </div>
        <div className="form-right">
            <img src={Logo} alt="Not Found!"/>
            <h1>AntyScam</h1>
            <p>"Where trust means decentralization"</p>
        </div>
    </>
    );

    const BackComponent = ()=> (
        <>
            <div className="form-left">
            <h1>Sign Up</h1>
            <div className="fields">
                    <input id="u_field" type="text" placeholder="Username"/>
                    <input id="e_field" type="email" placeholder="Email"/>
                    <input id="p_field" type="password" placeholder="Password"/>
                    <input id="cp_field" type="password" placeholder="Confirm Password"/>
            </div>  
            <div className="btn-row">
                <CustomButton onClick={handleSignUp} buttonText="Sign Up"/>
                <Link className="switch-text" to="" onClick={handleFlip}>
                    <p>Already a User?</p>
                </Link>
            </div>
        </div>
        <div className="form-right">
            <img src={Logo} alt="Not Found!"/>
            <h1>AntyScam</h1>
            <p>"Trust is just a synonym to us"</p>
        </div>
    </>
    );

    useEffect(()=>{
        if (isLoggedIn){
            navigate('/u-panel');
        }
    }, [isLoggedIn])

    return (
        <div className="form-body">
            <CustomButton className="back-btn" buttonText="< Go Back" buttonLink={"/"}/>
            <div className="c-container">
            {isLoading && <CustomLoader/>}
                <div
                    className={`flip-card ${
                        flipped ? "flipped" : ""
                    }`}
                >
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <div className="card-content">
                                {<FrontComponent/>}
                            </div>
                        </div>
                        <div className="flip-card-back">
                            <div className="card-content">
                                {<BackComponent/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};