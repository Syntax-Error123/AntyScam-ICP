import { useEffect, useState } from "react";
import { useErrorStore, useStore } from "../../store";
import { CustomLoader } from "../reusable/CustomLoader";

export default function TxsView() {
    const [rows, setRows] = useState([]);
    const { setError } = useErrorStore();
    const { walletAddress, preferences } = useStore();
    const [isLoading, setLoaded] = useState(false);

    const fetchTransactions = async () => {
        try {
            setLoaded(true);
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/db/get_transactions?wallet_address=${walletAddress}`
            );
            if (!response.ok) {
                throw new Error("Error fetching transactions");
            }
            const data = await response.json();
            setRows(data.txs);
        } catch (err) {
            setError(true, "Error", err.message, "fail");
        } finally {
            setLoaded(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <>
            {isLoading && <CustomLoader />}
            <div style={{ overflowX: "auto", scrollbarWidth: 'none', padding: "1rem" }}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Tx ID</th>
                            <th style={thStyle}>Time Created</th>
                            <th style={thStyle}>To</th>
                            <th style={thStyle}>From</th>
                            <th style={thStyle}>Amount</th>
                            <th style={thStyle}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.slice().reverse().map((row) => (
                            <tr key={row.id}>
                                <td style={tdStyle}>{row.id}</td>
                                <td style={tdStyle}>{row.time}</td>
                                <td style={tdStyle}>{row.to ?? '--'}</td>
                                <td style={tdStyle}>{row.from ?? '--'}</td>
                                <td style={tdStyle}>{(row.amount / 100).toFixed(2) + " " + preferences.currency}</td>
                                <td style={tdStyle}>{row.type.charAt(0).toUpperCase() + row.type.slice(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
};

const thTdStyle = {
    padding: "12px",
    borderBottom: "1px solid var(--col-prim-gray)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px",
};

const thStyle = {
    ...thTdStyle,
    backgroundColor: "var(--col-overlay-black)",
    letterSpacing: "0.1em",
    color: "var(--col-amb-red)",
    fontWeight: "bold",
};

const tdStyle = {
    ...thTdStyle,
    color: "var(--col-milky-white)",
};