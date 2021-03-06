import "../App.css";
import React, { Component, useEffect, useState } from "react";
// import MetaMaskAuth from "./metamask-auth";
// import CloneXLogo from "./images/X.png";
import MoaLogo from "../images/moa_logo_png.png"
import styles from "../main-stylesheet.css";
import shoecharm from "../images/shoecharm.png"
import shoecharm1 from "../images/shoecharmpng.png"

import groupshot from "../images/groupshot.jpeg"
import { BrowserRouter as Router, Link} from 'react-router-dom';


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
          <h1 className="Intro-text"> Do you own <span className="title"></span>?</h1>
          {/* <h1 className="Intro-text"> Let's meet, <a className="clones" href="https://clonex.rtfkt.com">Clones!</a> </h1> */}
          <h1 className="Intro-text"> Are you coming to <a href="https://gagosian.com/exhibitions/2022/takashi-murakami-an-arrow-through-history/">Gagosian NYC</a> <br/>in May?</h1>
          <h2> Wear this <div className="hovertext"><u> shoecharm </u><img className="hovertext" src={shoecharm} alt=""/></div>to the event and be included in a <div className="hovertext"> <u> groupshot </u><img className="hovertext" src={groupshot} alt=""/></div> as POAP!</h2>
          <h2> Verify your address to see if you're eligible </h2>
          <MetaMaskAuth onAddressChanged={(address) => {}} />
          <br/>
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
          <button className="button-85" role="button"
            onClick={() => {setFlag(true)}}
            //add inline function to change haveNFTs = True
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
      const dappUrl = "metamask-auth.ilamanov.repl.co"; // TODO enter dapp URL after done.
      const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
      return (
        <a href={metamaskAppDeepLink}>
          <button className="button-85" role="button"> Connect MetaMask </button>
          <br/>
        </a>
        
      );
    }

    return (
      <div className="buttonContainer">
        <button className="button-85" role="button"> Connect MetaMask </button>
      </div>
      
    );
  }

  function Address({ userAddress }) {
    return (
      <span className={styles.address}>
        
        {userAddress.substring(0, 5)}???{" "}
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

    const address = `0x8e2dc68f3d3a8391cc7f380b2ff6adf1f6f3073a`; 
    
    async function fetchList() {
      let nftListUrl = await FetchTransactions(address);
      setNftListUrl(nftListUrl)
    }
    
    useEffect(() => {
      fetchList();
    }, [address]);
    
    //change to userAddress later
    let imageElements
    if(nftListUrl) {
      imageElements = nftListUrl.map(value =><div className="gallery"><img src={value.url}/><div class="text">{value.tokenId}</div></div> )
    } else {
      imageElements = []
    }
    

    console.log('Running Display NFT, fetched urls')
    console.log(nftListUrl)

    return nftListUrl ? (
        <div>
            <div>
                <h2><br/>Congrats, fellow CloneX holder!</h2>
                <img src={groupshot} width="98%" height="98%" alt="'QR code here'" />
                <h3>As a long term holder,<br/> you are eligible to order a shoecharm for your Clone. </h3>
                <img src={shoecharm1}/>
                <h3>/***more description here***/
                <br/>When you arrive at the venue physically, 
                <br/> a chip inside of the charm will generate a groupshot as POAP. 
                <br/> Be ready for surprise airdrops and perks as well</h3>
                
                <h3>You can wear this to any future community events. </h3>
                <h3><br/>Please pick one NFT from your wallet below to redeem a shoecharm</h3>
                
            </div>

            <div className="clonepic">
            {imageElements}
            {/* <img src="https://clonex-assets.rtfkt.com/images/2123.png" width="50%" height="50%" alt='Clone image here'/> */}
            </div>

            <div>
            </div>
            <div><h2>/***order window here***/</h2></div>
            <h3>See you in May 16th at Gagosian gallery!</h3>
        </div>
        
    ):
    <div>`oops no NFTs to show'</div>;
    }}}
