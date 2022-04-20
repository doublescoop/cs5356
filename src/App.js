import "./App.css";
import React, { Component, useEffect, useState } from "react";
// import MetaMaskAuth from "./metamask-auth";
// import CloneXLogo from "./images/X.png";
import MoaLogo from "./images/moa_logo_png.png"
import styles from "./main-stylesheet.css";
import { isCommunityResourcable } from "@ethersproject/providers";
import { NavLink } from "react-router-dom";

// function App() {
export default class App extends Component {
    render() {
        const axios = require("axios").default;
        
        return (
    <main>
        <div className="logoContainer">
        <img className="App-logo" src={MoaLogo} alt="img here" />
        </div>

        <div className="App-title">
        </div>
        
        <div className="Intro">
          <h1 className="Intro-text"> Let's meet, <a className="clones" href="https://clonex.rtfkt.com">Clones!</a> </h1>
          <h1 className="Intro-text"> in May, at NYC</h1>
          <h2> Verify your address to get invited </h2>
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

    const address = `0x8e2dc68f3d3a8391cc7f380b2ff6adf1f6f3073a`; 
    useEffect(async () => {
      //proxy
      let nftListUrl = await FetchTransactions(address);
      setNftListUrl(nftListUrl)
    }, [address])
    
    //change to userAddress later
    let imageElements
    if(nftListUrl) {
      imageElements = nftListUrl.map(value =><div><img src={value.url}></img></div> )
    } else {
      imageElements = []
    }
    

    console.log('Running Display NFT, fetched urls')
    console.log(nftListUrl)

    return nftListUrl ? (
      <ul>
        <div>``
        <h3>Hello Clone! You're invited to a party for Clone in NYC.</h3>
        <h3>See you in May! Bring the QR code below to enter</h3>
        </div>

        <div className="clonepic">
          {imageElements}
          <img src="https://clonex-assets.rtfkt.com/images/2123.png" width="50%" height="50%" alt='Clone image here'/>
        </div>

        <div>
          <img src="./images/qr.jpg" width="50%" height="50%" alt='QR code here' />
        </div>

      </ul>
        
    ):
    <div>`oops no NFTs to show'</div>;
  }

  // function DisplayNFTs({ tokenIDs }) {
  //   // const buildURL = imagePath => `https://clonex-assets.rtfkt.com/images/${imagePath}.png`
  //   console.log("here");
  //   const tokens = this.props.tokenIDs

  //   return (
  //       tokens.forEach((token) => {
  //           const url = `https://clonex-assets.rtfkt.com/images/${token}.png`;
  //           <img src={url} alt="new" />
  //       }
  //   ));
  // }
}
}
