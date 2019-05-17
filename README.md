 


# transactioner

Manage simple transactions in pure JavaScript.

![](https://img.shields.io/badge/version-1.0.1-green.svg) ![](https://img.shields.io/badge/tests-100%25-green.svg) ![](https://img.shields.io/badge/coverage-100%25-green.svg) 

[![NPM](https://nodei.co/npm/transactioner.png?stars&downloads)](https://www.npmjs.com/package/transactioner)

## Install

`$ npm install transactioner`

## Usage

### Example 1: commit example

```js
const Transactioner = require("transactioner");
const transaction = new Transactioner();
const data = { i:0 };
const operation = {
 up:   () => { data.i++ },
 down: () => { data.i-- }
};
transaction.run(operation);
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 1
console.log(transaction.undoers.length); // >>> 1
transaction.run(operation);
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 2
console.log(transaction.undoers.length); // >>> 2
transaction.run(operation);
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 3
console.log(transaction.undoers.length); // >>> 3
transaction.commit();
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 3 // Data is preserved
console.log(transaction.undoers.length); // >>> 0 // And undoers are cleaned
```

### Example 2: rollback example

```js
const Transactioner = require("transactioner");
const transaction = new Transactioner();
const data = { i:0 };
const operation = {
 up:   () => { data.i++ },
 down: () => { data.i-- }
};
transaction.run(operation);
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 1
console.log(transaction.undoers.length); // >>> 1
transaction.run(operation);
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 2
console.log(transaction.undoers.length); // >>> 2
transaction.run(operation);
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 3
console.log(transaction.undoers.length); // >>> 3
transaction.rollback();
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> 3 // Data is rolled-back
console.log(transaction.undoers.length); // >>> 0 // Because undoers were executed and cleaned in reverse order
```

### Example 3: errors thrown on up will automatically rollback

```js
const Transactioner = require("transactioner");
const transaction = new Transactioner();
const data = { i:0 };
const operation = {
 up:   () => { throw {} },
 down: () => { data.i-- }
};
transaction.run(operation);
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> -1
```

### Example 4: on transactions committed or rolled-back, a new run, commit or rollback call throws an error

```js
const Transactioner = require("transactioner");
const transaction = new Transactioner();
const data = { i:0 };
const operation = {
 up:   () => { throw {} },
 down: () => { data.i-- }
};
transaction.run(operation);
console.log(data.i); // >>>>>>>>>>>>>>>>>>>>>>> -1
transaction.run(operation); // >>>>>>>>>>>>>>>> throws an ERROR: Transactioner.ERROR_TRANSACTION_STATUS_IS_ROLLEDBACK
transaction.reset();
data.i = 0;
const operation2 = { 
 up:   () => { data.i++ },
 down: () => { data.i-- }
};
transaction.run(operation2);
transaction.commit();
transaction.run(operation2); // >>>>>>>>>>>>>>> throws an ERROR: Transactioner.ERROR_TRANSACTION_STATUS_IS_COMMITTED
```

The examples of this document are tests at `test/transactioner.readme.test.js` file.

To have more detailed tests, you can find tests at `test/transactioner.api.test.js` file.

## API




 


----

#### Transactioner = require("transactioner")

**Type:** class

**Description:** Class that contains the API of the module.




 


----

#### transactioner = new Transactioner( t:Object? )

**Type:** constructor method

**Parameter:** t. Optional. Another transactioner instance from which to inherit the state. Take into account that in this case, a copy of the undoers and the state is made for this instance.

**Description:** The objects of this kind has the ability to run actions, and commit or rollback transactions.
They hold a status, which can be unfinished, committed or rolledback.




 


----

#### transactioner.undoers = []

**Type:** array &lt;Function&gt;

**InitialValue:** []

**Description:** Array containing the functions that roll-back the actions that weer run [but not rolled-back or committed yet].




 


----

#### transactioner.status

**Type:** number

**InitialValue:** 0 (= `Transactioner.STATUS_UNFINISHED`)

**Description:** Value that represents the current status of the transactioner instance. The available values are:

 - 0: `Transactioner.STATUS_UNFINISHED`. The transaction has not been committed or rolled-back.
 - 1: `Transactioner.STATUS_SUCCESS`. The transaction has been committed.
 - 2: `Transactioner.STATUS_ERROR`. The transaction has been rolled-back.

When the value of this proprty is not 0, the methods `run`, `commit` and `rollback` will be blocked and will throw errors.




 


----

#### transactioner.run(...actions)

**Type:** method

**Parameters:** `...actions`. Objects of the form: `{ up: &lt;Function&gt;, down: &lt;Function&gt; }`. The up functions are executed in the same call. The down functions are saved until the transactioner instance is:

 - rolled-back: in this case, the downs will be called reversedly, or:
 - committed: in this case, the downs will be deleted.

The down functions are saved under the `transactioner.undoers` array.

**Returns:** `Transactioner:Object`. The instance itself, to make it chainable, so you can:
```js
transactioner
 .run({ up: () => {}, down: () => {} })
 .run({ up: () => {}, down: () => {} })
 .run({ up: () => {}, down: () => {} })
 .run({ up: () => {}, down: () => {} })
 .commit();
```

**Throws:** `Transactioner.ERROR_TRANSACTION_STATUS_IS_COMMITTED` when the transactioner.status is `Transactioner.STATUS_SUCCESS`.

**Throws:** `Transactioner.ERROR_TRANSACTION_STATUS_IS_ROLLEDBACK` when the transactioner.status is `Transactioner.STATUS_ERROR`.




 


----

#### transactioner.commit()

**Type:** method

**Returns:** `Transactioner:Object`. The instance itself, to make it chainable.

**Description:** Commits the transaction, which means that the status is set to Transactioner.STATUS_SUCCESS, and the undoers are cleared.

**Throws:** `Transactioner.ERROR_TRANSACTION_STATUS_IS_COMMITTED` when the transactioner.status is `Transactioner.STATUS_SUCCESS`.

**Throws:** `Transactioner.ERROR_TRANSACTION_STATUS_IS_ROLLEDBACK` when the transactioner.status is `Transactioner.STATUS_ERROR`.




 


----

#### transactioner.reset()

**Type:** method

**Returns:** `Transactioner:Object`. The instance itself, to make it chainable.

**Description:** Commits the transaction, which means that the status is set to Transactioner.STATUS_SUCCESS, and the undoers are cleared.




 


----

#### transactioner.rollback()

**Type:** method

**Returns:** `Transactioner:Object`. The instance itself, to make it chainable.

**Description:** Rolls back the transaction, which means that the status is set to Transactioner.STATUS_ERROR, and the undoers are executed in the reversed order they were added.

**Throws:** `Transactioner.ERROR_TRANSACTION_STATUS_IS_COMMITTED` when the transactioner.status is `Transactioner.STATUS_SUCCESS`.

**Throws:** `Transactioner.ERROR_TRANSACTION_STATUS_IS_ROLLEDBACK` when the transactioner.status is `Transactioner.STATUS_ERROR`.

**Throws:** Any kind of error, if an undoer throws it.




 


----

#### transactioner.isFinished()

**Type:** method

**Returns:** isTransactionFinished:Boolean.

**Description:** Returns `true` when the transaction has been committed or rolled back, and false if its status is unfinished.




 


## Tests

To run the tests, including coverage, you can:

`$ cd node_modules/transactioner`

`$ npm install`

`$ npm run coverage`

## Issues

To submit issues, you can go [here](#).

## License

This software is under [WTFL](https://en.wikipedia.org/wiki/WTFPL), which means simply: do what you want.




