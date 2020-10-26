import { useMemo, useRef } from 'react';
import { useDisposableMemo } from 'use-dispose';
import createApp, { CustomMemo, HookMode, RenderMode } from './create-app';
import DisposableObject from './disposable-object';

const renderModes: RenderMode[] = [
  'blocking-mode',
  'concurrent-mode',
  'legacy-mode',
  'strict-mode',
];

const hookMode: HookMode[] = [
  'use-constant',
  'use-disposable-memo',
  'use-memo',
];

const useHooks: CustomMemo[] = [
  // useConstant
  (tracker, container, title) => {
    const ref = useRef<DisposableObject | undefined>();

    if (!ref.current) {
      ref.current = new DisposableObject(tracker, container, title);
    }

    return ref.current;
  },
  // useDisposableMemo
  (tracker, container, title) => (
    useDisposableMemo(
      () => new DisposableObject(tracker, container, title),
      (ref) => ref.dispose(),
      [tracker, container, title],
    )
  ),
  // useMemo
  (tracker, container, title) => (
    useMemo(
      () => new DisposableObject(tracker, container, title),
      [tracker, container, title],
    )
  ),
];

hookMode.forEach((hook, index) => {
  renderModes.forEach((mode) => {
    createApp(mode, hook, useHooks[index]);
  });
});
