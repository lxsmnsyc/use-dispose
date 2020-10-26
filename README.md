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

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)