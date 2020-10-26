# use-dispose

> React hook for running dispose logic for cancelled components.

[![NPM](https://img.shields.io/npm/v/use-dispose.svg)](https://www.npmjs.com/package/use-dispose) [![JavaScript Style Guide](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)

## Usage

### Install

```bash
yarn add use-dispose
```

### Why?

In Strict mode and Concurrent mode, components may render twice before commit to catch and prevent render-time side-effects. However, since the side-effects scheduled for `useLayoutEffect` and `useEffect` are never called on the first render, there could be unintended leaks like double event registrations from external sources.

`useDispose` attempts to solve this issue by running a registered cleanup for cancelled components, this helps clean and manage leaks that happened on the first render. `useDispose` only runs for cancelled components and not for components that runs their side-effects successfully.

```tsx
import { useDispose } from 'use-dispose';

// Creates an object with a cleanup logic inside it.
// React may create two instances during Strict and Concurrent Mode
// which can lead to undisposed instances like subscriptions.
const [state] = useState(() => new DisposableObject());

// useDispose guarantees that the object gets disposed when
// the component is cancelled.
useDispose(() => {
  state.dispose();
});
```

There's also the `useDisposableMemo` where the produced object from the memoization process which automatically gets disposed when a new object is produced, the component is cancelled or when the component unmounts:

```tsx
import { useDisposableMemo } from 'use-dispose';

// Create a disposable object that is automatically disposed
// on recomputation and on component cancellation/unmount.
const disposableObject = useDisposableMemo(
  () => new DisposableObject(deps1, deps2),
  (object) => object.dispose(),
  [deps1, deps2],
);
```

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)