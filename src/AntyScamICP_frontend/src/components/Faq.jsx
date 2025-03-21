import "../styles/faq.css";
import QNA from "./reusable/questionAnswer";

const questions = {
    'What is AntyScam?': 'AntyScam is a free and secure anti-scam website that helps peers trade without the risk of getting scammed. It utilizes blockchain technology to keep transparent records of the transactions which are irreversible. Moreover the inclusion of smart contracts eliminates the need for a middle-man which enhances the trust in the system.',
    'How does AntyScam work?': 'Once the trade is instantiated, the timer will start immediately. Both the parties are supposed to select their barter and lock the trade from their endpoint within this time frame. Once the trade is locked by both the parties the smart contracts will start the transfer process. Once the transfer is done the smart contract will put a temporary lock on the wallets of both the parties and the verification period will start. Within this time frame, the peers are supposed to verify the received goods or funds. Once both the parties mark it as verified, the trade is marked as a successful one and the wallet lock are released.',
    'What if I don\'t get what I paid for?': 'Incase one of the parties try to scam the other party by sending a fake or forged document, one can report the case and our arbiters will be at your service instantly. The arbiters will then verify the matter and resolve it. The problematic party will then be punished by the system with an account suspension. And don\'t worry the trade will revert and you will get your funds back.',
    'What are the available payment options?' : 'The platform provides almost all of the popular payment options such as Paypal, Stripe, Visa, American Expres, etc. Thereby, making it easy for you swifly recharge your wallet and execute trades.',
    'Does the platform have any additional fees' : 'Our platform has no additional fees expect the tiny gas fees that is charged once you execute a trade via smart contracts for the network to work sustainably.'
}

export default function Faq(){
    return <div className="faq-wrapper">
        <h2>Frequently asked questions</h2>
        <ul className="q-a">
            {Object.entries(questions).map(([question, answer], index)=>{
                return <QNA key= {index} index={index} question={question} answer={answer}/>
            })}
        </ul>
    </div>;
};