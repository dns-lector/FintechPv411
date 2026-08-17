// SPDX-License-Identifier: UNLICENSED
// усі смарт-контракти повинні починатись з ліцензії, що 
// регулює авторське право на його код 

pragma solidity ^0.8.28;
// обов'язково зазначити обмеження на версію компілятора

contract Counter {                    // контракт є аналогом класу (ООП)
  uint public x;                      // поле типу uint - типізація статична
                                      // 
  event Increment(uint by);           // 
                                      // 
  function inc() public {             // 
    x += 1;                           // 
    emit Increment(1);                // 
  }                                   // 
                                      // 
  function incBy(uint by) public {    // 
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }
}
