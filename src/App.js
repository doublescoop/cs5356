import "./App.css";
import React, { Component, useEffect, useState } from "react";

// import MetaMaskAuth from "./metamask-auth";
// import CloneXLogo from "./images/X.png";
import MoaLogo from "./images/moa_logo_png.png"
import styles from "./main-stylesheet.css";
import eventinfo from "./images/murakamievent.png"
import qrplaceholder from './images/qrdemo.png'
import db from "./services/firestore";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"; 





export default class App extends Component {
    render() {
        const axios = require("axios").default;
        <script src="scripts/model3d.js"></script>
        return (
    <main>
        <div className="logoContainer">
        <img className="App-logo" src={MoaLogo} alt="img here" />
        </div>
        {/* <div class="sketchfab-embed-wrapper"> 
          <iframe title="Charmock" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share width="640" height="480" 
          src="https://sketchfab.com/models/1bb941e013d14c25946f9ad55f7d1249/embed?autospin=1&amp;autostart=1&amp;ui_hint=2&amp;camera=0&amp;preload=1&amp;"> </iframe> 
        </div> */}
        {/* <img src={shoecharm} alt="img here" /> */}

        <div className="App-title">
        </div>

        <div className="Intro">
          <h2 className="Intro-text"> Dear <span className="title"></span>s,</h2>
          <h1 className="Intro-text"> Let's bring it to real world! Exclusive art shows, meetups, limited edition goods waiting for your NFTs.</h1>  
          {/* <h3 className="Intro-text"> Are you coming to <a href="https://gagosian.com/exhibitions/2022/takashi-murakami-an-arrow-through-history/">Gagosian NYC</a> <br/>in May?</h3> */}
          <h2> Verify your address to see if you're eligible </h2>
          <MetaMaskAuth onAddressChanged={(address) => {}} />
          
        </div>
        
    </main>
    );


  function isMobileDevice() {
    return "ontouchstart" in window || "onmsgesturechange" in window;
  }

  async function connect(onConnected) {
    if (!window.ethereum) {
      alert("Download MetaMask to verify your address");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    onConnected(accounts[0]);
  }

  async function checkIfWalletIsConnected(onConnected) {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        onConnected(account);
        return;
      }

      if (isMobileDevice()) {
        await connect(onConnected);
      }
    }
  }

  function MetaMaskAuth({ onAddressChanged }) {
    const [userAddress, setUserAddress] = useState("");
    const [nftList, setNftList] = useState("")

    //proxy
    const address = `0x8e2dc68f3d3a8391cc7f380b2ff6adf1f6f3073a`;

    useEffect(() => {
      checkIfWalletIsConnected(setUserAddress);
    }, []);

    useEffect(() => {
      onAddressChanged(userAddress);
    }, [userAddress]);
    
    const [flag, setFlag] = useState(false);

    return userAddress ? (
      <div>
        <h2>Connected with <u> <Address userAddress={userAddress} /></u></h2>
        <div>
          <button className="button-85"
            onClick={() => {setFlag(true)}}
          >
            Fetch Clones
          </button>
          {flag ? <DisplayNFT userAddress={userAddress} /> : <div></div> }
          <h2>{nftList}</h2>
        </div>
        {/* <h2>You have {nftList.length} Clones </h2> */}
      </div>
    ) : (
      <Connect setUserAddress={setUserAddress} />
    );
    
  }

  function Connect({ setUserAddress }) {
    if (isMobileDevice()) {
      const dappUrl = "https://fir-57d50.web.app/home"; // TODO enter dapp URL after done.
      const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
      return (
        <a href={metamaskAppDeepLink}>
          <button className="button-85" onClick={() => connect(setUserAddress)}> Connect MetaMask </button>
        </a>
      );
    }

    return (
      <div className="buttonContainer">
              <button className="button-85" onClick={() => connect(setUserAddress)}>
 Connect MetaMask </button>
      </div>
      
    );
  }

  function Address({ userAddress }) {
    return (
      <span className={styles.address}>
        
        {userAddress.substring(0, 5)}…{" "}
        {userAddress.substring(userAddress.length - 4)}
      </span>
    );
  }


  async function FetchTransactions({ userAddress }) {
    //use the userAddress to call etherscan api, check erc721 tokens
    //proxy for testing
    const address = `0x8e2dc68f3d3a8391cc7f380b2ff6adf1f6f3073a`;
    // Project of interest (Clone X in this case)
    const projectAddress = `0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B`;
    const myAPI = `8RSW3P93XHUN46I2PWSB3P3N7VWZ48FX3P`;
    console.log(`Fetching Txs on X For ${address}`);

    // https://etherscan.io/apis#tokennfttx change to userAdress later
    const URL = `https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${projectAddress}&address=${address}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${myAPI}`;
    const response = await axios.get(URL);
    
    console.log(response.data.status);
    console.log(response.data.message);

    const data = response.data.result;
    console.log(`address is ${address}`);
    console.log(
      `Total ${data.length} X token transactions found for this address`
    );

    // value = {FetchTransactions({ userAddress })}
    // onClick={e => setNftList(e.target.value)}

    // const nftList = [];
    // const nftListUrl = [];
    // data.forEach((block) => {
    //   nftList.push(block["tokenID"]);
    //   nftListUrl.push(`https://clonex-assets.rtfkt.com/images/${block["tokenID"]}.png`)
    // });

    const nftListUrl = data.map(block => {
      return {
        tokenId: block.tokenID,
        url: `https://clonex-assets.rtfkt.com/images/${block["tokenID"]}.png`
      }
    })
    // console.log(nftList);
    // console.log(nftListUrl);
    
    return (nftListUrl);
  }

  
  function DisplayNFT({userAddress}) {
    const [nftListUrl, setNftListUrl] = useState(null)
    const [user, setUser] = useState("");
    const [likedList, setLikedList] = useState("");

    const address = `0x8e2dc68f3d3a8391cc7f380b2ff6adf1f6f3073a`; 
    
    async function fetchList() {
      let nftListUrl = await FetchTransactions(address);
      setNftListUrl(nftListUrl)
    }
    
    useEffect(() => {
      fetchList();
    }, [address]);

    function submit (user,likedList) {
      console.log('user:', user, 'created an invitation for the chosen NFT: ',likedList)
      const userRef = addDoc(collection(db, "Users"), {
            address: user,
            likedToken: likedList,
            // created: serverTimestamp()
          });
      console.log("added user info for User Reference ID: ", userRef);
      setUser(user);
      setLikedList(likedList);
    };
  
    
    //change to userAddress later
    let imageElements
    if(nftListUrl) {
      imageElements = nftListUrl.map(value =><div className="gallery"><img align="top" src={value.url} onClick={() => submit(address, value.tokenId)} alt="" /> <div className="text">{value.tokenId}</div></div> )
    } else {
      imageElements = []
    }
    

    console.log('Running Display NFT, fetched urls')
    console.log(nftListUrl)

    const timestamp = Date.now(); // This would be the timestamp you want to format
    new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp)

    return nftListUrl ? (

      <div>
        {(() => {
          if (likedList) {
            return (
            <div>
                <h2>your invitation for Clone {likedList} is here:</h2>
                <h3>Please take a screenshot and bring it to the venue</h3>  
                <h2></h2>
                <div>
                <img src={`https://clonex-assets.rtfkt.com/images/${likedList}.png`} width="30%" height="50%" alt=""/>
                <img src={qrplaceholder} width="30%" height="50%" alt=""/>
                </div>
                <h3>Murakami Exhibition is open for May 11th - June 25th at Gagosian gallery in NYC!</h3>
            </div>
            )
          } else {
            return (<div>
              <div>
                <h1><br/>Congrats, fellow CloneX holder!</h1>
                <h2><br/>There is an event for your project in May, @NYC! </h2>
                <img src={eventinfo} width="98%" height="98%" alt="'QR code here'" />
                <h2><br/><strong>Please pick one NFT from your wallet below</strong> to redeem a ticket and be included in the attendance check!</h2>
              </div>

              <div className="clonepic">
              {imageElements}
              {/* <img src="https://clonex-assets.rtfkt.com/images/2123.png" width="50%" height="50%" alt='Clone image here'/> */}
              </div>

              <div>
              <div><h2>/***order window here***/</h2></div>
              <h3>See you in May 16th at Gagosian gallery!</h3>
              </div>
            </div>)
          }
        })()}
      </div>
      

        // <div>
        //   likedList? (
        //     <div><h1>your invitation for {</h1></div>

        //   ):
        //   <div>
        //           <h1><br/>Congrats, fellow CloneX holder!</h1>
        //           <h2><br/>There is an event for your project in May, @NYC! </h2>
        //           <img src={eventinfo} width="98%" height="98%" alt="'QR code here'" />
        //           <h2><br/><strong>Please pick one NFT from your wallet below</strong> to redeem a ticket and be included in the attendance check!</h2>
        //         </div>

        //         <div className="clonepic">
        //         {imageElements}
        //         {/* <img src="https://clonex-assets.rtfkt.com/images/2123.png" width="50%" height="50%" alt='Clone image here'/> */}
        //         </div>

        //         <div>
        //         <div><h2>/***order window here***/</h2></div>
        //         <h3>See you in May 16th at Gagosian gallery!</h3>
        //         </div>
        // </div>
        
    ):
    <div>`oops no NFTs to show'</div>;
    }}}
