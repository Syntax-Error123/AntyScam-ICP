import {useStore, useErrorStore} from '../store';

export const usePaymentHandler = () => {
    const { userData } = useStore();
    const { setError } = useErrorStore();

    const handleDeposit = async () => {
        if (userData?.verified === 'pending' || userData?.verified === 'in_process') {
            setError(true, "Error", "You must verify your account first!", "fail");
        } else if (!userData?.walletAddress){
            setError(true, "Error", "Connect your wallet first!", "fail");
        }
        else {
            window.location.href = `${process.env.REACT_APP_STRIPE_CHECKOUT_URL}`;
        }
    };

    const handleWithdraw = () => {
        if (userData?.verified === 'pending' || userData?.verified === 'in_process') {
            setError(true, "Error", "You must verify your account first!", "fail");
        } else if (!userData?.walletAddress){
            setError(true, "Error", "Connect your wallet first!", "fail");
        } 
        else{
            setError(true, "Note", "Withdrawals aren't possible in the test mode.", "default");
        }
    };

    return { handleDeposit, handleWithdraw };
};