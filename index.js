import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const withdrawButton = document.getElementById("withdrawButton")
const balanceButton = document.getElementById("balanceButton")

connectButton.onclick = connect
fundButton.onclick = fund
withdrawButton.onclick = withdraw
balanceButton.onclick = getBalance

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectButton.innerHTML = "Connected"
        } catch (error) {
            console.log(error)
        }
    } else {
        connectButton.innerHTML = "Please Install Metamask"
    }
}

async function fund() {
    let ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {
        // provider / connection to blockchain
        // signer / wallet / someone with gas
        //contrct that we will interact with ABI and Address

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMined(transactionResponse, provider)
            console.log("Done....")
        } catch (error) {
            console.log(error)
        }
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMined(transactionResponse, provider)
        } catch (e) {
            console.log(e)
        }
    }
}

function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}....`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `completed With ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum !== "undefinded") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        document.getElementById("balance").innerHTML =
            ethers.utils.formatEther(balance) + " Ethers"
    }
}
