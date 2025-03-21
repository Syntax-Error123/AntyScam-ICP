import '../styles/intro.css';
import Logo from '../assets/images/intro-image.svg';
import Arrow from '../assets/images/arrow.svg';
import { Typewriter } from 'react-simple-typewriter';
import CustomButton from './reusable/CustomButton';
import { useStore } from '../store';

export default function Intro(){
    const {isLoggedIn} = useStore();
    return <div className="intro-wrapper">
        <div className="intro-left">
            <h1><Typewriter words={['Welcome Aboard',]}
                loop={true}
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1500}
                cursor={true}
                cursorBlinking={false}
                cursorColor='#ff5757'
                cursorStyle='!'
            /></h1>
            <p>We provide decentralized escrow services that enables <span>P2P trading</span> with transparency and <span>0% risk</span> in zero-trust environments.</p>
            <CustomButton className='nav-btn'
                    buttonText="Get Started" 
                    buttonLink={!isLoggedIn ? '/sign-up' : '/u-panel'}
                    showIcon={true}
                    icon={Arrow}
                    />
        </div>
        <div className="intro-right">
            <img src={Logo} alt='Not Found!' title='Intro Image'/>
        </div>
    </div>; 
}