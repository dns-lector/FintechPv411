import { useEffect, useState } from 'react'
import CounterABI from '../../evm/artifacts/contracts/Counter.sol/Counter.json';
import './App.css'
import { ethers } from 'ethers';

const RPC_URL = "http://127.0.0.1:8545/";
const counterAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

// MetaMask надає бібліотеки, але вбудовує їх до BOM (window.)
// TypeScript має стандартне означення ВОМ, тому необхідно розширити
// її інтерфейс
declare global {
  interface Window {
    ethereum: ethers.Eip1193Provider | undefined
  }
}

function App() {
  // дані про авторизацію користувача (його обліковий запис)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner|null>(null);

  // дані про мережу (криптомережу), з якою здійснюється робота
  const [networkInfo, setNetworkInfo] = useState<ethers.Network|null>(null);

  // дані про контракт, з яким здійснюється робота
  const [contractData, setContractData] = useState('');
  const [getCntData, setGetCntData] = useState('');
  // дані форми для введення інкременту
  const [inpInc, setInpInc] = useState<number>(2);

  useEffect(() => {
    // стартовий ефект - підключення та налаштування
    const jsonProvider:ethers.JsonRpcProvider =  // Remote Procedure Call
      new ethers.JsonRpcProvider(RPC_URL);       // одержуємо провайдера за адресою

    // вилучаємо з провайдера деталі мережі
    jsonProvider.getNetwork().then(setNetworkInfo);
  }, []);

  const connectWallet = async () => {
    // перевіряємо чи встановлено MetaMask
    // це слідує з наявності у ВОМ відповідних даних
    if(!window.ethereum) {
      alert("Для роботи з криптомережею необхідно встановити MetaMask");
      return;
    }
    // запитуємо обліковий запис
    try {
      await window.ethereum.request({method: 'eth_requestAccounts'});
      // додаємо "обгортку" для браузерів
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      // через неї вилучаємо обліковий запис користувача
      const sgnr = await browserProvider.getSigner();
      console.log(sgnr);
      setSigner(sgnr);
    }
    catch(err) {
      alert("У доступі відмовлено " + JSON.stringify(err));
    }
  };

  const activateCounter = async () => {
    if(!signer) {
      alert("Спочатку необхідно підключитись до мережі");
      return;
    }
    try {
      const contract = new ethers.Contract(counterAddress, CounterABI.abi, signer);
      const data = await contract.inc();
      console.log(data);
      setContractData(data);
    }
    catch(err) {
      alert("Помилка виконання " + JSON.stringify(err));
    }
  };

  const incCounter = async () => {
    if(!signer) {
      alert("Спочатку необхідно підключитись до мережі");
      return;
    }
    //if(inpInc <= 0) {
    //  alert("Значення має бути додатнім");
    //  return;
    //}
    try {
      const contract = new ethers.Contract(counterAddress, CounterABI.abi, signer);
      const data = await contract.incBy(inpInc);
      console.log(data);
      setContractData(data);
    }
    catch(err) {
      alert("Помилка виконання " + JSON.stringify(err));
    }
  };

  const decCounter = async () => {
    if(!signer) {
      alert("Спочатку необхідно підключитись до мережі");
      return;
    }
    //if(inpInc <= 0) {
    //  alert("Значення має бути додатнім");
    //  return;
    //}
    try {
      const contract = new ethers.Contract(counterAddress, CounterABI.abi, signer);
      const data = await contract.decBy(inpInc);
      console.log(data);
      setContractData(data);
    }
    catch(err:any) {
      alert("Помилка виконання " + (
        typeof err.reason == 'undefined' ? JSON.stringify(err) : err.reason)
      );
    }
  };

  const getCounter = async () => {
    if(!signer) {
      alert("Спочатку необхідно підключитись до мережі");
      return;
    }
    try {
      const contract = new ethers.Contract(counterAddress, CounterABI.abi, signer);
      const data = await contract.getCount();
      console.log(data);
      setGetCntData(data);
    }
    catch(err) {
      alert("Помилка виконання " + JSON.stringify(err));
    }
  };

  return <>
  <h1>Hardhat + React + Ethers</h1>
  <button onClick={connectWallet}>Connect Wallet</button>
  {signer && <pre>{JSON.stringify(signer,null,4)}</pre>}
  <button onClick={activateCounter}>Counter</button>
  {contractData && <pre>{JSON.stringify(contractData,null,4)}</pre>}
  <button onClick={getCounter}>GET Counter</button>
  {/* Solidity оперує з даними, типовим розміром 256 біт
      У JS це відповідає BigInt і вимагає коригування способу JSON серіалізації */}
  {getCntData && <pre>{JSON.stringify(getCntData, (_, v) => typeof v === 'bigint' ? `${v.toString()}n` : v, 4)}</pre>}
  
  <input type='number' 
    value={inpInc} onChange={e => setInpInc(Number(e.target.value))} />
  <button onClick={incCounter}>INC Counter</button>  
  <button onClick={decCounter}>DEC Counter</button>  
  </>;
}

export default App
/*
Взамодія з криптомережами здійснюється через бібліотеки, що 
надає MetaMask. Протокол взаємодії - ABI (App Binary Interface).

Дані для протоколу генеруються при компіляції смарт-контракта
(npx hardhat compile) і знаходяться у 
evm/artifacts/contracts/...
.../Counter.sol/Counter.json
Дані можна скопіювати або послатись за іменем файлу

Сам смарт-контракт розміщений у мережі і звернення до нього
іде через адресу мережі та адресу контакта в неї. 

Д.З. Реалізувати взаємодію фронтенда з методом "dec" смарт-контракту Counter.
Перевірити як правильну роботу, так і виняткову через досягнення нуля.
Додати скріншоти.
*/