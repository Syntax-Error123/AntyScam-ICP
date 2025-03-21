export function NotAvailable(){
    return <div style={{
        height: '100vh',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <h1 style={{
            color: '#fff',
            background: '#212121',
            border: '#ff5757 2px dashed',
            padding: '20px',
            borderRadius: '16px'
        }}>The requested page doesn't exist!</h1>
    </div>
}