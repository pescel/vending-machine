export default class VendingMachine {
  constructor() {
    // status can be ["idle", "credited", "vending"]
    this.state = {
      status: 'idle',
      credits: 0,
      change: 0,
      errorMsg: '',
      selectedItem: {},
      dispensedItem: {},
      inventory: {
        A1: { item: 'shoe laces', amount: 100 },
        A2: { item: 'duct tape', amount: 100 },
        A3: { item: 'umbrella', amount: 100 },
        B1: { item: 'pair of mismatched socks', amount: 100 },
        B2: { item: 'bed bath and beyond coupon', amount: 100 },
        B3: { item: 'christmas napkins', amount: 100 },
        C1: { item: '25 cents', amount: 100 },
        C2: { item: 'baby powder', amount: 100 },
        C3: { item: 'one chopstick', amount: 100 }
      }
    }
  }

  //first step: user has to insert credits
  insertCredits(name, credits) {
    this.state.credits = credits;
    this.state.status = 'credited';
  }

  // step 2: user makes selection and either gets back item, gets item and change, or gets error message 'item doesnt exsist'
  selectItem(selection) {
    this.state.selectedItem = this.state.inventory[selection];
    if(this.selectionExists()) {
      this.checkCredits()
    } else {
      this.state.errorMsg = 'This item does not exist. Try making a different selection.'
    }
  }

  // Check that the selectedItem has the attributes amount & item
  selectionExists() {
    return this.state.selectedItem &&
      this.state.selectedItem.item && 
      this.state.selectedItem.amount
  }

  checkCredits() {
    if(this.hasEnoughCredits()) {
      this.getItem()
      this.dispenseChange()
    } else {
      this.state.errorMsg = 'Not enough credits.'
    }
  }

  hasEnoughCredits() {
    return this.state.selectedItem.amount <= this.state.credits
  }

  //step 3: vending machine dispenses selectedItem and change if necessary
  getItem() {
    this.state.dispensedItem = this.state.selectedItem;
    this.state.credits = 0
  }

  dispenseChange() {
    if (this.state.credits > this.state.selectedItem.amount) {
      this.state.change = this.state.credits - this.state.selectedItem.amount
      this.state.credits = 0
    }
  }

  reset() {
    this.constructor()
  }
}
