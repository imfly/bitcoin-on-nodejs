## From 2.0.0 to 3.0.0

 -  Renamed to ``Task`` (makes more sense, since now they represent actions).

 -  **BREAKING:** Removed ``Future.memoise``.

 -  Major performance improvements.

 -  **BREAKING:** Fixed resource management introduced in 2.x.

 
## 2.3.0

 -  Allows actions to be cancelled.

 - Adds ``Future.rejected``.

 - Adds a catamorphism that takes an object.

 - Deprecates ``Future.memoise``.


## 2.2.0

 -  Semigroup instance for nondeterministic combination.


## 2.1.0

 -  **BREAKING:** Removes Applicative instance.


## From 1.0.0 to 2.0.0

 -  **BREAKING:** removed partial functions and fields (`toString`, `isEqual`,
    `isPending`, `isResolved`, `isRejected`), since you can't observe them
    always, and it leads to confusing behaviour. This functionality will be
    moved to a co-future later.

 -  **BREAKING:** removed default memoisation. Since the Futures are just
    placeholders for actions, it does make sense that chaining a Future twice
    should execute the action twice. When you want memoisation, you can use the
    `Future.memoise` construct instead of `new Future`.

    ```js
    // Before:
    new Future(function(reject, resolve) { ... })

    // Now:
    Future.memoise(function(reject, resolve) { ... })
    ```

## 1.0.0

Initial release
