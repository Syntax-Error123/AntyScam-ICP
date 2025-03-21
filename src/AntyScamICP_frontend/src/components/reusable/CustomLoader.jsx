import { CircularProgress } from "@mui/joy";

export const CustomLoader = () => {
    return (
        <CircularProgress variant="soft" sx={{
            position: "absolute !important",
            zIndex: 9999,
            top: "50%",
            left: "60%",
            transform: 'translate(-50%, -50%)',
        }}/>
    );
}