import {network} from "hardhat";

// смарт-контракти публікуються у певній мережі.
// початкова дія - підключення до мережі.
const {ethers, networkName} = await network.create();
console.log('Start deploying in network', networkName);

// знаходимо посилання на контракт 
// (у стандартній директорії /contracts)
const counter = await ethers.deployContract("Counter");

// запускаємо публікацію
console.log("Deployment started...");
await counter.waitForDeployment();
console.log("Deployment finished...");

// одержуємо адресу опублікованого контракта
console.log('Contract address: ', await counter.getAddress())

// виконуємо пробне звернення до методу .inc() (див. Counter.sol)
console.log('Calling .inc() method...');
const task = await counter.inc();

// метод запускає подію, результат якої також слід чекати.
console.log('Waiting event result...', task);
await task.wait();

const cnt = await counter.getCount();
console.log("getCount -> ", cnt);

console.log('Deployment finished');


/*
Скласти скрипт публікації смарт-контракту, що 
складено на попередньому ДЗ, запустити, 
переконатись в успішному результаті.
Вивести у консоль адресу опублікованого контракту,
прикласти скріншот.
*/