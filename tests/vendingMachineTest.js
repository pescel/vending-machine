require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

const assert = require('chai').assert
const VendingMachine = require('../vendingMachine').default
const Person = require('../person').default

describe('VendingMachine', function() {
  const vendingMachine = new VendingMachine()
  const alex = new Person('Alex', 100)

  afterEach(function() {
    vendingMachine.reset();
  });

  it('should show status of idle when no one is using the vending machine', () => {
    // Assert the current status of the vendingMachine is idle
    assert.equal(vendingMachine.state.status, 'idle')

    // Alex inserts a dollar into the vending machine
    vendingMachine.insertCredits(alex, 100)

    // Assert the current status of the vendingMachine is 'credited' after credits inserted
    assert.equal(vendingMachine.state.status, 'credited')
    // Assert the total number of credits is 100 cents ($1.00) after credits inserted
    assert.equal(vendingMachine.state.credits, 100)
    // Assert the total number of change is 0 cents ($0.00) before selection is made
    assert.equal(vendingMachine.state.change, 0)
  });

  it('should update the vending machines credits and status when insertCredits is called', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)

    vendingMachine.insertCredits('alex', 100)

    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.status, 'credited')
    vendingMachine.reset()
  });

  it('should take in the users credits and check if they need change', () => {
    assert.equal(vendingMachine.state.status, 'idle')

    vendingMachine.insertCredits(alex, 100)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.change, 0)
  });

  it('should show error message if the selected item does not exist', () => {
    assert.equal(vendingMachine.state.status, 'idle')

    vendingMachine.insertCredits(alex, 100)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.selectItem('Y5')
    assert.equal(vendingMachine.state.credits, 100)
    assert.equal(vendingMachine.state.change, 0)
    assert.equal(vendingMachine.state.inventory['Y5'], undefined)
    assert.equal(vendingMachine.state.errorMsg, 'This item does not exist. Try making a different selection.')
    vendingMachine.reset()
  });

  it('should show error message if user did not give enough credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')

    vendingMachine.insertCredits(alex, 50)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 50)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.selectItem('B2')
    assert.deepEqual(vendingMachine.state.selectedItem, { item: 'bed bath and beyond coupon', amount: 100 })
    assert.equal(vendingMachine.state.credits, 50)
    assert.equal(vendingMachine.state.change, 0)
    assert.deepEqual(vendingMachine.state.inventory['B2'], { item: 'bed bath and beyond coupon', amount: 100 })
    assert.equal(vendingMachine.state.errorMsg, 'Not enough credits.')
    vendingMachine.reset()
  });

  it('should give user correct item based on selection if they gave enough credits', () => {
    assert.equal(vendingMachine.state.status, 'idle')

    vendingMachine.insertCredits(alex, 200)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 200)
    assert.equal(vendingMachine.state.change, 0)

    vendingMachine.selectItem('C1')
    assert.deepEqual(vendingMachine.state.selectedItem, { item: '25 cents', amount: 100 })
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 100)
    assert.equal(vendingMachine.state.inventory['C1'], { item: '25 cents', amount: 100 })

    vendingMachine.reset();
  });


  it('should check if item exists when selectionExists is called', () => {
    vendingMachine.state.selectedItem = vendingMachine.state.inventory['A1']
    vendingMachine.selectionExists()
    assert.equal(vendingMachine.state.selectedItem.item, 'shoe laces')
    assert.equal(vendingMachine.state.selectedItem.amount, 100)
    vendingMachine.reset()
  });

  it('should dispense item and return change when user inserts enough credits and checkCredits is called', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)

    vendingMachine.insertCredits('alex', 100)
    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 100)
    vendingMachine.state.selectedItem = { item: 'christmas napkins', amount: 100 }
    vendingMachine.checkCredits()
    assert.deepEqual(vendingMachine.state.dispensedItem, { item: 'christmas napkins', amount: 100 })
    vendingMachine.reset()
  })


  it('should give the user their selected item when getItem is called', () => {
    assert.equal(vendingMachine.state.status, 'idle')
    assert.equal(vendingMachine.state.credits, 0)
    vendingMachine.insertCredits('alex', 100)

    assert.equal(vendingMachine.state.status, 'credited')
    assert.equal(vendingMachine.state.credits, 100)
    vendingMachine.state.selectedItem = { item: 'umbrella', amount: 100}
    vendingMachine.getItem()
    assert.equal(vendingMachine.state.credits, 0)
    assert.equal(vendingMachine.state.change, 0)
    assert.deepEqual(vendingMachine.state.inventory['A3'], { item: 'umbrella', amount: 100 })
    vendingMachine.reset()
  });
});
