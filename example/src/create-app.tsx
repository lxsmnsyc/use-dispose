import React, { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import DisposableObject from './disposable-object';
import ObjectTracker from './object-tracker';

export type RenderMode =
  | 'legacy-mode'
  | 'strict-mode'
  | 'blocking-mode'
  | 'concurrent-mode';

export type HookMode =
  | 'use-memo'
  | 'use-constant'
  | 'use-disposable-memo';

export type CustomMemo =
  (
    tracker: ObjectTracker<DisposableObject>,
    container: HTMLElement,
    title: string,
  ) => DisposableObject;

function useDelayedRender(): boolean {
  const [state, setState] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setState(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return state;
}

export default function createApp(
  mode: RenderMode,
  batch: HookMode,
  useMemoCustom: CustomMemo,
): void {
  const root = document.getElementById(`${batch}__${mode}`);

  if (root) {
    const tracker = new ObjectTracker<DisposableObject>();

    const App = () => {
      useMemoCustom(tracker, root, mode);

      const isValidating = useDelayedRender();

      if (isValidating) {
        return <span>{`${mode}: Loading...`}</span>;
      }

      console.log(mode, batch, tracker);

      return (
        <span>{`${mode}: ${tracker.objects.length === 1 ? '👍' : '💀'}`}</span>
      );
    };

    if (mode === 'blocking-mode') {
      ReactDOM.unstable_createBlockingRoot(root).render(<App />);
    }
    if (mode === 'concurrent-mode') {
      ReactDOM.unstable_createRoot(root).render(<App />);
    }
    if (mode === 'legacy-mode') {
      ReactDOM.render(<App />, root);
    }
    if (mode === 'strict-mode') {
      ReactDOM.render(<StrictMode><App /></StrictMode>, root);
    }
  }
}
