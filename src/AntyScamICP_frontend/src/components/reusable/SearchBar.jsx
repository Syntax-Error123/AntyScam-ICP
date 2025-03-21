import { useEffect, useRef, useState } from "react";
import "../../styles/searchbar.css";
import { useErrorStore, useStore } from "../../store";
import { CustomLoader } from "./CustomLoader";
import CustomDialog from "./CustomDialog";
import { Avatar } from "@mui/joy";
import { IoPersonAdd } from "react-icons/io5";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [active, setActive] = useState(false);
  const [statusChecker, setStatusChecker] = useState(null);
  const inputRef = useRef();
  const {userData, setUserData, setInputRef} = useStore();
  const {setError} = useErrorStore();

  useEffect(()=>{
    if (inputRef.current){
      setInputRef(inputRef.current);
    }
  }, [setInputRef]);

  const checkUserStatus = async (username) =>{
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/misc/status/checkStatus/${username}`)
                  .then(res=>res.json())
                  .then(data=>setActive(data.online));
                  
        const interval = setInterval(()=>{
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/misc/status/checkStatus/${username}`)
                .then(res=>res.json())
                .then(data=>setActive(data.online));
        }, 10000);
        return interval;
  };

  useEffect(()=>{
    const interval = setInterval(()=>{
        if (!document.hidden){
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/misc/status/updateStatus`,{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({userId: userData?.username})
            });
        }
    }, 1000);
    return () => clearInterval(interval);
},[]);

  useEffect(()=>{
    if (!searchQuery.trim()){
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try{
        const respone = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/db/search_users?query=${searchQuery}`);
        if (!respone.ok) {throw new Error("Error fetching users")}
        const data = await respone.json();
        setResults(data.users);
      }catch(err){
        setError(true, "Error", err.message, 'fail');
      }finally{
        setLoading(false);
      }
    }
    const debounceTimer = setTimeout(fetchResults, 700);
    return ()=> clearTimeout(debounceTimer);
  },[searchQuery]);

  const addfriend = async (userId) => {
      try{
      setIsLoading(true);
      const result = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/misc/friend/add/${userId}`,{
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          user: userData.username,
        })
      });
      if (!result.ok) {throw new Error("Error Adding Friend!")};
      const data = await result.json();
      setUserData(data.user_data[0]);
      setError(true, 'Success', "Friend Added successfully", 'success');
    }catch(err){
      setError(true, 'Error', err.message, 'fail');
    }finally{
      setIsLoading(false);
    }
  }
 
  const handleOpenDialog = async (user) => {
    setActive(false);
    setSelectedUser(user);
    const checker = await checkUserStatus(user.username);
    setStatusChecker(() => checker);
  };

  const handleCloseDialog = () => {
    setActive(false);
    setSelectedUser(null);
    if (statusChecker) {
      clearInterval(statusChecker);
      setStatusChecker(() => null);
    }
  };

  return (
  <>
    <div style={{display: 'flex', direction: 'row', position: 'relative'}}>
      <div className="s-container">
        <input type="text" name="text" ref={inputRef} className="input" autoComplete="off" required placeholder="Search Here..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
            <title>Search</title>
            <path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={32} />
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={32} d="M338.29 338.29L448 448" />
          </svg>
        </div>
        </div>
        {
          searchQuery && (
            <div className="search-results">
              {loading?(
                <CustomLoader/>
              ) : results.length > 0 ? (
                  results.map((user)=>(
                    <div key={user.id} className="search-result-item" onClick={()=> handleOpenDialog(user)}>
                      <span style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 0}}>
                        <Avatar sx={{scale: 0.5}}/>
                        <p>{user.username}</p>
                      </span>
                    </div>
                  ))
              ) : (<p style={{alignSelf: 'center'}}>No search results!</p>)}
            </div>
          )
        }
      </div>
      <CustomDialog open={!!selectedUser} setOpen={handleCloseDialog} positionChildren="start" title={'Profile'}>
        {isLoading && <CustomLoader/>}
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',  gap: 10,}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Avatar sx={{scale: '0.8'}}/>
            <h3 style={{color: 'var(--col-milky-white)'}}>{selectedUser?.username}</h3>
          </div>
          {selectedUser?.username !== userData?.username && !userData?.friends.includes(selectedUser?.id) && <IoPersonAdd onClick={()=>addfriend(selectedUser?.id)} size={20} color="#fff" style={{background: 'var(--col-amb-red)', padding: '4px', borderRadius: '8px', cursor: 'pointer'}}/>}
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 0}}>
          <p style={{marginTop: 0, marginBottom: 0, color: 'var(--col-prim-gray)', fontSize: '0.8em'}}>{active ? '🟢 Online': '🔴 Offline'}</p>
          <p style={{marginTop: 0, marginBottom: 0, color: `${selectedUser?.verified === 'complete' ? '#22ff88' : '#ff5050'}`, fontSize: '0.8em'}}>{selectedUser?.verified === 'complete' ? 'Verified ✓' : 'Not Verified X'}</p>
        </div>
        <p style={{fontSize: '.9em',margin: 0, color: 'var(--col-amb-red)'}}>{'Trade Value < 100$'}</p>
        <p style={{fontSize: '.9em',marginTop: 0, color: 'var(--col-amb-red)'}}>Member since {new Date(selectedUser?.createdAt._seconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20,}}>
          <p style={styles.tradeDetails}>Trades Completed <br/>{selectedUser?.completedTrades}</p>
          <p style={styles.tradeDetails}>Disputes Encountered <br/>{selectedUser?.disputes}</p>
          <p style={styles.tradeDetails}>Reputaion Score <br/>{selectedUser?.reputationScore}</p>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',  gap: 30, marginTop: '20px', borderTop: '1px var(--col-prim-gray) solid', width: '100%'}}>
          <p style={{cursor: 'pointer', color: 'var(--col-milky-white)', paddingRight: '30px', borderRight: '1px var(--col-prim-gray) solid',  transition: "color 0.2s ease",}} onMouseEnter={(e)=>e.target.style.color="var(--col-amb-red)"} onMouseLeave={(e)=>e.target.style.color="var(--col-milky-white)"}>Report</p>
          <p style={{cursor: 'pointer', color: 'var(--col-milky-white)',  transition: "color 0.2s ease",}} onMouseEnter={(e)=>e.target.style.color="var(--col-amb-red)"} onMouseLeave={(e)=>e.target.style.color="var(--col-milky-white)"}>Block</p>
        </div>
      </CustomDialog>
      </>
  );
}

const styles = {
  tradeDetails: {
    marginTop: 0,
    marginBottom: 0,
    borderRadius: '8px',
    backgroundColor: 'var(--col-prim-gray)',
    color: 'var(--col-body-black)',
    padding: '4px 8px',
    fontSize: '0.8em',
    fontWeight: '600',
    textAlign: 'center'
  }
}

export default SearchBar;