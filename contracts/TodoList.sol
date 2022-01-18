// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  event TaskAdded(uint id, string content, bool completed);

  constructor() public {
    addTask("Learn solidity");
    addTask("Learn new vocabulary");
  }

  function addTask(string memory _content) public {
    taskCount++;
    tasks[taskCount] = Task(taskCount, _content, false);
    emit TaskAdded(taskCount, _content, false);
  }
}
