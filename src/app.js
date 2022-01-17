const App = {
  isLoading: false,
  contracts: {},

  load: async() => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    web3.eth.getAccounts().then(function(accounts){
      App.account = accounts[0];
    })
  },

  loadContract: async() => {
    const todoList = await $.getJSON('TodoList.json');
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);
    App.todoList = await App.contracts.TodoList.deployed();
  },

  render: async() => {
    App.setIsLoading(true);
    // render content
    $('#account').html(App.account);
    await App.renderTasks();

    App.setIsLoading(false)
  },

  renderTasks: async() => {
    const taskCount = await App.todoList.taskCount();
    const $taskItem = $('.task-item');

    for(let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      const $task = $taskItem.clone();
      $task.css('display', 'block')
      $task.find('.form-check-label').html(taskContent);
      $task.find('input')
        .prop('name', taskId)
        .prop('checked', taskCompleted)
        // .on('click', App.toggleComplete)

      if (taskCompleted) {
        $('#completed-task-list').append($task);
      } else {
        $('#task-list').append($task);
      }
    }
  },

  setIsLoading: (isLoading) => {
    App.isLoading = isLoading;
    const loader = $('#loader');
    const content = $('#content');
    if (isLoading) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  }
}
 
$(() => {
  $(window).load(() => {
    App.load();
  })
})