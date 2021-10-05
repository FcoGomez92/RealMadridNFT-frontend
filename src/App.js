import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import myEpicNft from "./utils/MyEpicNFT.json";
import Logo from "./utils/Logo.js";
import Example_NFT from "./utils/Example_NFT.js";
import close from "./utils/close.png";
import { formatEther } from "@ethersproject/units";
import ModalComponent from "./utils/ModalComponent.js";

// Constants
const TWITTER_HANDLE = ["FcoGomez92_", "_buildspace"];
const personal_TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE[0]}`;
const buildspace_TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE[1]}`;
const OPENSEA_LINK =
  "https://testnets.opensea.io/collection/realmadridnft-s21-22";
const TOTAL_MINT_COUNT = 100;
const CONTRACT_ADDRESS = "0xeB4B6d3f7477749ee5E76fcC6054282C638B0FB2";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [nftsMinted, setNftsMinted] = useState();
  const [accInfo, setAccInfo] = useState({});
  const [connectionError, setConnectionError] = useState("");
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [newNft, setNewNft] = useState({});
  const myRef = useRef(null);

  const executeScroll = () =>
    myRef.current.scrollIntoView({ behavior: "smooth" });

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      console.log(accounts);
      const account = accounts[0];
      console.log("Found an authorized account: ", account);

      checkWalletNetwork();
      getInfo(account);
      setCurrentAccount(account);
      getNftsMinted();
      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask first!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      getInfo(accounts[0]);
      setCurrentAccount(accounts[0]);
      checkWalletNetwork();
      getNftsMinted();
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        connectedContract.on(
          "NewEpicNFTMinted",
          (from, tokenId, playerName, playerNumber) => {
            console.log(from, tokenId.toNumber());

            if (from.toLowerCase() === currentAccount) {
              setNewNft({
                playerName,
                playerNumber,
                message:
                  "Congrats! Here is how your NFT looks like!\n You can see it on OpenSea.io by following the link below.\n It may be blank right now, because It can take a max of 10 min to show up.",
                link: `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`,
              });
            }
            getNftsMinted();
          }
        );

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    await executeScroll();
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        checkWalletNetwork();
        if (connectionError) {
          setStatus({
            type: "Connection Error",
            message:
              "Wrong Network! Do you want to lose money?\n Please connect your wallet to Rinkeby Testnet.",
          });

          return;
        }
        setIsLoading(true);
        setStatus({
          type: "Init",
          message: "Going to pop wallet now to pay gas...",
        });

        let nftTxn = await connectedContract.makeAnEpicNFT();

        setStatus({
          type: "Mining",
          message: "Mining...please wait.",
        });
        await nftTxn.wait();

        setStatus({
          type: "Mined",
          message: "✅ Mined! See your transaction on Etherscan: ",
          link: `https://rinkeby.etherscan.io/tx/${nftTxn.hash}`,
        });
        setIsLoading(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setStatus({
        type: "Transaction Error",
        message: "Transaction Cancelled",
      });
      setIsLoading(false);
    }
  };

  const getNftsMinted = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        const nftsNum = await connectedContract.getTotalNFTsMinted();
        setNftsMinted(nftsNum.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getInfo = async (account) => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const balance = await provider.getBalance(account);

      const showAcc =
        account.substring(0, 5) + "..." + account.substring(account.length - 4);
      setAccInfo({
        Acc: showAcc,
        AccBalance: formatEther(balance).substring(0, 4) + " ETH",
      });
    }
  };

  const checkWalletNetwork = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("You need to conect to metamask first");
      return;
    } else {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const network = await provider.detectNetwork();
      if (network.chainId !== 4) {
        setConnectionError("Please connect your wallet to Rinkeby Testnet");
        return;
      }
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect Wallet
    </button>
  );

  const renderMintUI = () => (
    <>
      {status.message && executeScroll()}
      <button
        onClick={() => {
          askContractToMintNft();
        }}
        className="cta-button mint-button"
        disabled={isLoading}
      >
        Mint NFT
      </button>
      {status.message && (
        <div className="status-div">
          {isLoading && <div className="spinner"></div>}
          {status.type === "Init" || status.type === "Mining" ? null : (
            <span
              onClick={() => {
                setStatus({});
              }}
            >
              <img src={close} width="30px" alt="" />
            </span>
          )}
          <p>{status.message}</p>
          {status.link && (
            <a href={status.link} target="_blank" rel="noreferrer">
              {"🌐 " + status.link}
            </a>
          )}
        </div>
      )}
    </>
  );

  const checkChanges = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("You need to conect to metamask first");
      return;
    } else {
      // The "any" network will allow spontaneous network changes
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      provider.on("network", (newNetwork, oldNetwork) => {
        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        if (oldNetwork) {
          window.location.reload();
        }
      });
    }
  };
  const handleModalClose = () => {
    setNewNft({});
  };

  return (
    <div className="App">
      {checkChanges()}
      {newNft.message && (
        <ModalComponent onClose={handleModalClose} closeIcon={close}>
          <div className="newNft-data">
            <Example_NFT
              name={newNft.playerName}
              number={newNft.playerNumber}
            />
            <div className="status-div st-modal">
              <p>{newNft.message}</p>
              {newNft.link && (
                <a
                  href={newNft.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontWeight: "500" }}
                >
                  🌐 View on OpenSea
                </a>
              )}
            </div>
          </div>
        </ModalComponent>
      )}
      <div className="container">
        <div className="header-container">
          <Logo width="300" heigth="75" />
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <div className={connectionError ? "acc-err-on" : "acc-err-off"}>
              <div className="acc-info">
                <p className="acc-balance">{accInfo.AccBalance}</p>
                <div className="acc">
                  <p>{accInfo.Acc}</p>
                </div>
              </div>
              {connectionError && (
                <p className="err-conection-p">{connectionError}</p>
              )}
            </div>
          )}
        </div>
        <main className="main-content">
          <div className="examples-grid">
            <Example_NFT name="Modric" number="10" />

            <Example_NFT name="Vini Jr." number="20" />

            <Example_NFT name="Benzema" number="9" />
          </div>
          <div className="opensea-button">
            <a href={OPENSEA_LINK} target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="none"
                viewBox="0 0 100 100"
              >
                <path
                  fill="currentColor"
                  d="M100 50C100 77.6127 77.6127 100 50 100C22.3873 100 0 77.6127 0 50C0 22.3873 22.3873 0 50 0C77.6185 0 100 22.3873 100 50Z"
                />
                <path
                  id="path1"
                  fill="#fff"
                  d="M24.6679 51.6801L24.8836 51.341L37.8906 30.9932C38.0807 30.6953 38.5276 30.7261 38.6714 31.0497C40.8444 35.9196 42.7194 41.9762 41.841 45.7468C41.466 47.2982 40.4386 49.3992 39.2827 51.341C39.1338 51.6236 38.9694 51.901 38.7947 52.1681C38.7125 52.2914 38.5738 52.3633 38.4248 52.3633H25.048C24.6884 52.3633 24.4778 51.9729 24.6679 51.6801Z"
                />
                <path
                  id="path2"
                  fill="#fff"
                  d="M82.6444 55.461V58.6819C82.6444 58.8668 82.5314 59.0312 82.367 59.1031C81.3602 59.5346 77.9132 61.1168 76.48 63.11C72.8224 68.2008 70.0279 75.48 63.7812 75.48H37.721C28.4847 75.48 21 67.9697 21 58.7024V58.4045C21 58.1579 21.2003 57.9576 21.4469 57.9576H35.9745C36.2621 57.9576 36.4727 58.2247 36.4471 58.5072C36.3443 59.4524 36.519 60.4182 36.9659 61.2966C37.8289 63.0484 39.6166 64.1426 41.5481 64.1426H48.74V58.5278H41.6303C41.2656 58.5278 41.0499 58.1065 41.2605 57.8086C41.3375 57.6904 41.4249 57.5672 41.5173 57.4285C42.1903 56.473 43.1509 54.9884 44.1064 53.2983C44.7588 52.1579 45.3906 50.9404 45.8992 49.7178C46.002 49.4969 46.0841 49.2708 46.1663 49.0499C46.305 48.6595 46.4489 48.2948 46.5516 47.9301C46.6544 47.6218 46.7365 47.2982 46.8187 46.9951C47.0602 45.9574 47.1629 44.8581 47.1629 43.7177C47.1629 43.2708 47.1424 42.8033 47.1013 42.3564C47.0807 41.8684 47.0191 41.3803 46.9574 40.8923C46.9163 40.4608 46.8393 40.0344 46.7571 39.5875C46.6544 38.9351 46.5105 38.2879 46.3461 37.6354L46.2896 37.3889C46.1663 36.9419 46.0636 36.5156 45.9198 36.0687C45.5139 34.6662 45.0465 33.2998 44.5533 32.0207C44.3735 31.5121 44.168 31.0241 43.9625 30.5361C43.6595 29.8015 43.3512 29.1337 43.0687 28.5018C42.9249 28.2141 42.8016 27.9521 42.6783 27.685C42.5396 27.3819 42.3958 27.0788 42.2519 26.7912C42.1492 26.5703 42.031 26.3648 41.9488 26.1593L41.0704 24.536C40.9471 24.3151 41.1526 24.0531 41.394 24.1199L46.8907 25.6096H46.9061C46.9163 25.6096 46.9215 25.6148 46.9266 25.6148L47.6509 25.8151L48.4472 26.0412L48.74 26.1233V22.8562C48.74 21.2791 50.0037 20 51.5654 20C52.3462 20 53.0551 20.3185 53.5637 20.8373C54.0722 21.3562 54.3907 22.0651 54.3907 22.8562V27.7056L54.9764 27.8699C55.0226 27.8854 55.0688 27.9059 55.1099 27.9367C55.2538 28.0446 55.4592 28.2038 55.7212 28.3991C55.9267 28.5634 56.1476 28.7638 56.4147 28.9693C56.9438 29.3956 57.5757 29.9453 58.2692 30.5772C58.4541 30.7364 58.6339 30.9008 58.7983 31.0652C59.6922 31.8974 60.6939 32.8734 61.6494 33.9522C61.9165 34.2553 62.1785 34.5635 62.4456 34.8871C62.7127 35.2159 62.9953 35.5395 63.2418 35.8632C63.5655 36.2947 63.9148 36.7416 64.2179 37.2091C64.3617 37.43 64.5261 37.656 64.6648 37.8769C65.0552 38.4676 65.3994 39.079 65.7282 39.6903C65.8669 39.9728 66.0107 40.281 66.134 40.5841C66.4987 41.4009 66.7864 42.2331 66.9713 43.0653C67.0278 43.2451 67.0689 43.4403 67.0895 43.615V43.6561C67.1511 43.9026 67.1717 44.1646 67.1922 44.4317C67.2744 45.2845 67.2333 46.1372 67.0484 46.9951C66.9713 47.3599 66.8686 47.704 66.7453 48.0688C66.622 48.4181 66.4987 48.7828 66.3395 49.127C66.0313 49.841 65.6665 50.5551 65.235 51.2229C65.0963 51.4695 64.9319 51.7315 64.7675 51.9781C64.5877 52.24 64.4028 52.4866 64.2384 52.7281C64.0124 53.0363 63.771 53.3599 63.5244 53.6476C63.3035 53.9507 63.0775 54.2538 62.8309 54.5209C62.4867 54.9267 62.1579 55.312 61.8137 55.6819C61.6083 55.9233 61.3874 56.1699 61.1613 56.3908C60.9405 56.6373 60.7144 56.8582 60.5089 57.0637C60.1648 57.4079 59.8771 57.675 59.6356 57.8959L59.0706 58.4148C58.9884 58.4867 58.8805 58.5278 58.7675 58.5278H54.3907V64.1426H59.8976C61.1305 64.1426 62.3018 63.7059 63.247 62.9045C63.5706 62.622 64.9833 61.3994 66.6528 59.5552C66.7093 59.4935 66.7813 59.4473 66.8635 59.4268L82.0742 55.0295C82.3568 54.9473 82.6444 55.163 82.6444 55.461Z"
                />
              </svg>
              View Collection on OpenSea
            </a>
          </div>
          <div className="action-div">
            <p className="sub-text">
              Mint for free and get your random RM Player. Limit of 100 units.
            </p>
            <div className="col-data">
              <p>
                <span>
                  Minted {nftsMinted ? nftsMinted : "?"} / {TOTAL_MINT_COUNT}
                </span>
              </p>
            </div>
          </div>
          <div className="action-div">
            {currentAccount === ""
              ? renderNotConnectedContainer()
              : renderMintUI()}
          </div>
        </main>
        <div ref={myRef} className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={buildspace_TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE[1]}`}</a>
          <p style={{ margin: "5px" }}>
            project build with<span style={{ margin: "5px" }}>❤️</span> by
          </p>
          <a
            className="footer-text"
            href={personal_TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE[0]}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
