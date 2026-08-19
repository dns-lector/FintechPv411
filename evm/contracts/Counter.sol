// SPDX-License-Identifier: UNLICENSED
// усі смарт-контракти повинні починатись з ліцензії, що 
// регулює авторське право на його код 

pragma solidity ^0.8.28;
// обов'язково зазначити обмеження на версію компілятора

contract Counter {                    // контракт є аналогом класу (ООП)
  uint public x;                      // поле типу uint - типізація статична
                                      // 
  event Increment(uint by);           // Події - засіб інформування про зміни
                                      // у смарт-контракті
  function inc() public {             // 
    x += 1;                           // зміна стану - немає інформування
    emit Increment(1);                // запуск події - інформування
  }                                   // 
                                      // 
  function incBy(uint by) public {    // 
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }
}
