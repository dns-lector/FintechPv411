import {network} from "hardhat";

// смарт-контракти публікуються у певній мережі.
// початкова дія - підключення до мережі.
const {ethers, networkName} = await network.create();
console.log('Start deploying in network', networkName);

// знаходимо посилання на контракт (у стандартній директорії /contracts)
// Для передачі даних до конструктора зазначаємо їх масив другим аргументом
const greeter = await ethers.deployContract(
    "Greeter",    // Назва смарт-контракту
    ["Hello"]     // аргументи для конструктора
);

// запускаємо публікацію
console.log("Deployment started...");
await greeter.waitForDeployment();
console.log("Deployment finished...");

// одержуємо адресу опублікованого контракта
console.log('Contract address: ', await greeter.getAddress());

// пробний запуск
const task = await greeter.greet();
console.log(task);

console.log('Deployment finished');
