const Transactioner = require(__dirname + "/../src/transactioner.js");
const { assert, expect } = require("chai");

describe("Transactioner README examples", function() {
	it("can reproduce the 1st example", function() {
		const transaction = new Transactioner();
		const data = { i: 0 };
		const operation = {
			up: () => {
				data.i++;
			},
			down: () => {
				data.i--;
			}
		};
		transaction.run(operation);
		// console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 1
		// console.log(transaction.undoers.length); // >>> 1
		transaction.run(operation);
		// console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 2
		// console.log(transaction.undoers.length); // >>> 2
		transaction.run(operation);
		// console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 3
		// console.log(transaction.undoers.length); // >>> 3
		transaction.commit();
		// console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 3 // Data is preserved
		// console.log(transaction.undoers.length); // >>> 0 // And undoers are cleaned
		///////////////////////////////////////////////
		expect(data.i).to.equal(3);
		expect(transaction.undoers.length).to.equal(0);
	});

	it("can reproduce 2nd example", function() {
		const transaction = new Transactioner();
		const data = { i: 0 };
		const operation = {
			up: () => {
				data.i++;
			},
			down: () => {
				data.i--;
			}
		};
		transaction.run(operation);
		// console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 1
		// console.log(transaction.undoers.length); // >>> 1
		transaction.run(operation);
		// console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 2
		// console.log(transaction.undoers.length); // >>> 2
		transaction.run(operation);
		// console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 3
		// console.log(transaction.undoers.length); // >>> 3
		transaction.rollback();
		// console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 3 // Data is rolled-back
		// console.log(transaction.undoers.length); // >>> 0 // Because undoers were executed and cleaned in reverse order
		///////////////////////////////////////////////
		expect(data.i).to.equal(0);
		expect(transaction.undoers.length).to.equal(0);
	});

	it("can reproduce 3rd example", function() {
		const transaction = new Transactioner();
		const data = { i: 0 };
		const operation = {
			up: () => {
				throw {};
			},
			down: () => {
				data.i--;
			}
		};
		transaction.run(operation);
		expect(data.i).to.equal(-1);
	});

	it("can reproduce 4th example", function() {
		const transaction = new Transactioner();
		const data = { i: 0 };
		const operation = {
			up: () => {
				throw {};
			},
			down: () => {
				data.i--;
			}
		};
		transaction.run(operation);
		expect(data.i).to.equal(-1); // >>>>>>>>>>>>>>>>>>>>>>> -1
		expect(() => {
			transaction.run(operation); // >>>>>>>>>>>>>>>> throws an ERROR: Transactioner.ERROR_TRANSACTION_STATUS_IS_ROLLEDBACK
		}).to.throw();
		transaction.reset();
		data.i = 0;
		const operation2 = {
			up: () => {
				data.i++;
			},
			down: () => {
				data.i--;
			}
		};
		transaction.run(operation2);
		transaction.commit();
		expect(() => {
			transaction.run(operation2); // >>>>>>>>>>>>>>> throws an ERROR: Transactioner.ERROR_TRANSACTION_STATUS_IS_COMMITTED
		}).to.throw();
	});
});
