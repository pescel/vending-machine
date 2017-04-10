require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

const assert = require('chai').assert
const VendingMachine = require('../vendingMachine').default
const Person = require('../person').default

describe('Person', function() {
  it(should start off with 500 credits) {
    assert.equal(Person.state.credits, 500)
  }
}
