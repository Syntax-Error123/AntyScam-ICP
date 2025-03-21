import { Modal, ModalClose, ModalDialog } from "@mui/joy";

export default function CustomDialog({open, setOpen,title, width, description, positionChildren='flex-end', layout='center', children}){
    return <Modal open={open} onClose={setOpen}>
        <ModalDialog layout={layout} sx={{backgroundColor: '#212121', width: width, outline: '#a6a6a6', display: 'flex',}}>
            {title && <h2 style={{color: 'white', margin: 0}}>{title}</h2>}
            {description && <p style={{color: '#cec7bf', marginTop: 0,}}>{description}</p>}
            {children && <div style={{display: "flex", flexDirection: 'column', justifyContent: `${positionChildren}`, gap: '10px'}}>{children}</div>}
            {setOpen && <ModalClose/>}
        </ModalDialog>
    </Modal>
}