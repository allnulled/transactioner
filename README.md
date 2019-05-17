 


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

**Type:** Array<Function>

**InitialValue:** []

**Description:** Array containing the functions that roll-back the actions that weer run [but not rolled-back or committed yet].




 


----

#### transactioner.status

**Type:** number

**InitialValue:** 0 (Transactioner.STATUS_UNFINISHED)

**Description:** Value that represents the current status of the transactioner instance. The available values are:
 - 0: Transactioner.STATUS_UNFINISHED. The transaction has not been committed or rolled-back.
 - 1: Transactioner.STATUS_SUCCESS. The transaction has been committed.
 - 2: Transactioner.STATUS_ERROR. The transaction has been rolled-back.
When the value of this proprty is not 0, the methods `run`, `commit` and `rollback` will be blocked and will throw errors.




 


----

#### transactioner.run(...actions)

**Type:** method

**Parameters:** ...actions. Objects of the form: { up: <Function>, down: <Function> }. The up functions are executed in the same call. The down functions are saved until the transactioner instance is:
 - rolled-back: in this case, the downs will be called reversedly, or:
 - committed: in this case, the downs will be deleted.
The down functions are saved under the `transactioner.undoers` array.

**Returns:** Transactioner:Object. The instance itself, to make it chainable, so you can:
```js
transactioner
 .run({ up: () => {}, down: () => {} })
 .run({ up: () => {}, down: () => {} })
 .run({ up: () => {}, down: () => {} })
 .run({ up: () => {}, down: () => {} })
 .commit();
```

**Throws:** Transactioner.ERROR_TRANSACTION_STATUS_IS_COMMITTED when the transactioner.status is Transactioner.STATUS_SUCCESS.

**Throws:** Transactioner.ERROR_TRANSACTION_STATUS_IS_ROLLEDBACK when the transactioner.status is Transactioner.STATUS_ERROR.




 


----

#### transactioner.commit()

**Type:** method

**Returns:** Transactioner:Object. The instance itself, to make it chainable.

**Description:** Commits the transaction, which means that the status is set to Transactioner.STATUS_SUCCESS, and the undoers are cleared.

**Throws:** Transactioner.ERROR_TRANSACTION_STATUS_IS_COMMITTED when the transactioner.status is Transactioner.STATUS_SUCCESS.

**Throws:** Transactioner.ERROR_TRANSACTION_STATUS_IS_ROLLEDBACK when the transactioner.status is Transactioner.STATUS_ERROR.




 


----

#### transactioner.reset()

**Type:** method

**Returns:** Transactioner:Object. The instance itself, to make it chainable.

**Description:** Commits the transaction, which means that the status is set to Transactioner.STATUS_SUCCESS, and the undoers are cleared.




# Read this file
