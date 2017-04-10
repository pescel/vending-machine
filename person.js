export default class Person {
  constructor() {
    // each person starts out with 5 dollars
    this.state = {
      credits: 500,
      name:  '',
      items: []
    }
  }

  //step 1: user inserts credits
  userInsertsCredits(insertedCredits) {
    let userCredits = this.state.credits - insertedCredits;
  }

  //step 2: user makes a selection
  selectItem(itemNumber) {
    // interact with vendingMachine instance, selectItem, retrieve item from machine.dispensedItem
    // put that item into items array
  }

  //step 3: user gets their change back (if necessary)
  getChangeBack(change) {
    let changeAmount = this.state.credits + change;
  }
}
