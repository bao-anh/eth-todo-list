var chai = require('chai');
const TodoList = artifacts.require("./TodoList.sol");

const { assert } = chai;

contract('TodoList', (accounts) => {
  before(async() => {
    this.todoList = await TodoList.deployed();
  })

  it('deploy successfully', async () => {
    const address = await this.todoList.address;

    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  })

  it('list tasks', async () => {
    const taskCount = await this.todoList.taskCount();
    const task = await this.todoList.tasks(taskCount);

    assert.equal(task.id.toNumber(), taskCount.toNumber());
    assert.equal(task.content, "Learn new vocabulary");
    assert.equal(task.completed, false);
  })

  it('add task', async () => {
    const result = await this.todoList.addTask('A new task');
    
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), 3);
    assert.equal(event.content, "A new task");
    assert.equal(event.completed, false);
  })
})