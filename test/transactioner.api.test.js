const Transactioner = require(__dirname + "/../src/transactioner.js");
const { assert, expect } = require("chai");

describe("Transactioner", function() {
	it("can run and automatically rollback on errors thrown while changing the status to STATUS_ERROR", function() {
		var i = 0;
		const t = new Transactioner();
		const opIncrease = function() {
			i += 1;
		};
		const opDecrease = function() {
			i -= 1;
		};
		const op = {
			up: opIncrease,
			down: opDecrease
		};
		t.run(op);
		t.run(op);
		t.run(op);
		t.run(op);
		t.run(op);
		t.run({
			up: () => {
				throw {};
			},
			down: () => {
				i = 20;
			}
		});
		expect(i).to.equal(15);
		expect(t.undoers.length).to.equal(0);
		expect(t.status).to.equal(t.constructor.STATUS_ERROR);
	});

	it("can run and commit while changing the status to STATUS_SUCCESS", function() {
		var i = 0;
		const t = new Transactioner();
		const opIncrease = function() {
			i += 1;
		};
		const opDecrease = function() {
			i -= 1;
		};
		const op = {
			up: opIncrease,
			down: opDecrease
		};
		t.run(op);
		t.run(op);
		t.run(op);
		t.run(op);
		t.run(op);
		expect(i).to.equal(5);
		expect(t.undoers.length).to.equal(5);
		t.commit();
		expect(t.undoers.length).to.equal(0);
		expect(i).to.equal(5);
		expect(t.status).to.equal(t.constructor.STATUS_SUCCESS);
	});

	it("can run and commit and then block later run/commit/rollback calls", function() {
		var i = 0;
		const t = new Transactioner();
		const opIncrease = function() {
			i += 1;
		};
		const opDecrease = function() {
			i -= 1;
		};
		const op = {
			up: opIncrease,
			down: opDecrease
		};
		t.run(op);
		t.run(op);
		t.run(op);
		t.run(op);
		t.run(op);
		expect(i).to.equal(5);
		expect(t.undoers.length).to.equal(5);
		t.commit();
		expect(() =>
			t.run({
				up: () => {},
				down: () => {}
			})
		).to.throw("TransactionStatusIsCommittedError");
		expect(() => t.commit()).to.throw("TransactionStatusIsCommittedError");
		expect(() => t.rollback()).to.throw("TransactionStatusIsCommittedError");
	});

	it("can run and rollback and then block later run/commit/rollback calls", function() {
		var i = 0;
		const t = new Transactioner();
		const opIncrease = function() {
			i += 1;
		};
		const opDecrease = function() {
			i -= 1;
		};
		const op = {
			up: opIncrease,
			down: opDecrease
		};
		t.run(op);
		t.run(op);
		t.run(op);
		t.run(op);
		t.run(op);
		expect(i).to.equal(5);
		expect(t.undoers.length).to.equal(5);
		t.rollback();
		expect(() =>
			t.run({
				up: () => {},
				down: () => {}
			})
		).to.throw("TransactionStatusIsRolledbackError");
		expect(() => t.commit()).to.throw("TransactionStatusIsRolledbackError");
		expect(() => t.rollback()).to.throw("TransactionStatusIsRolledbackError");
	});

	it("can reset status and reuse the same transaction object", function() {
		const t = new Transactioner();
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		expect(t.undoers.length).to.equal(7);
		t.commit();
		expect(t.undoers.length).to.equal(0);
		expect(t.status).to.equal(t.constructor.STATUS_SUCCESS);
		t.reset();
		expect(t.status).to.equal(t.constructor.STATUS_UNFINISHED);
		expect(t.undoers.length).to.equal(0);
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		expect(t.undoers.length).to.equal(7);
	});

	it("can initialize transactions based on others (it can chain transactions)", function() {
		const t = new Transactioner();
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		expect(t.undoers.length).to.equal(7);
		const t2 = new Transactioner(t);
		expect(t2.undoers.length).to.equal(7);
	});

	it("can check its own status with isFinished() differently with inherited transaction", function() {
		const t = new Transactioner();
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		t.run({ up: () => {}, down: () => {} });
		expect(t.isFinished()).to.equal(false);
		const t2 = new Transactioner(t);
		expect(t2.undoers.length).to.equal(7);
		expect(t2.isFinished()).to.equal(false);
		t2.commit();
		expect(t2.isFinished()).to.equal(true);
		expect(t.isFinished()).to.equal(false);
		t.rollback();
		expect(t.isFinished()).to.equal(true);
	});

});
