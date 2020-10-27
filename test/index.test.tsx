import React, { StrictMode, useEffect, useState } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDisposableMemo, useDispose } from '../src';

jest.useFakeTimers();

describe('useDispose', () => {
  it('should run on component cancellation on StrictMode', () => {
    let disposed = false;
    function ExampleApp() {
      useDispose(() => {
        disposed = true;
      });

      return null;
    }

    render((
      <StrictMode>
        <ExampleApp />
      </StrictMode>
    ));

    jest.advanceTimersByTime(16);

    expect(disposed).toBe(true);
  });
  it('should run on component cancellation only in initial render on StrictMode', () => {
    let disposed = false;
    function ExampleApp() {
      useDispose(() => {
        disposed = true;
      }, true);

      return null;
    }

    render((
      <StrictMode>
        <ExampleApp />
      </StrictMode>
    ));

    jest.advanceTimersByTime(16);

    expect(disposed).toBe(true);
  });
  it('should run on component cancellation after setState on StrictMode', () => {
    let disposedCount = 0;
    function ExampleApp() {
      useDispose(() => {
        disposedCount += 1;
      });

      const [, setState] = useState(false);
      useEffect(() => {
        setState(true);
      }, []);

      return null;
    }

    render((
      <StrictMode>
        <ExampleApp />
      </StrictMode>
    ));

    jest.advanceTimersByTime(16);

    expect(disposedCount).toBe(2);
  });
});

describe('useDisposableMemo', () => {
  it('should run disposal during component cancellation on initial render on StrictMode', () => {
    let disposed = false;
    function ExampleApp() {
      useDisposableMemo(
        () => undefined,
        () => {
          disposed = true;
        },
      );

      return null;
    }

    render((
      <StrictMode>
        <ExampleApp />
      </StrictMode>
    ));

    jest.advanceTimersByTime(16);

    expect(disposed).toBe(true);
  });
  it('should not run on component cancellation after setState on StrictMode', () => {
    let disposedCount = 0;
    function ExampleApp() {
      useDisposableMemo(
        () => undefined,
        () => {
          disposedCount += 1;
        },
      );

      const [, setState] = useState(false);
      useEffect(() => {
        setState(true);
      }, []);

      return null;
    }

    render((
      <StrictMode>
        <ExampleApp />
      </StrictMode>
    ));

    jest.advanceTimersByTime(16);

    expect(disposedCount).toBe(1);
  });
  it('should run disposal during component unmount', () => {
    let disposedCount = 0;
    function ExampleApp() {
      useDisposableMemo(
        () => undefined,
        () => {
          disposedCount += 1;
        },
      );

      return null;
    }

    function RemountingParent() {
      const [state, setState] = useState(true);
      useEffect(() => {
        setState(false);
      }, []);

      if (state) {
        return <ExampleApp />;
      }
      return null;
    }

    render((
      <StrictMode>
        <RemountingParent />
      </StrictMode>
    ));

    jest.advanceTimersByTime(16);

    expect(disposedCount).toBe(2);
  });
  it('should run disposal during dependency change', () => {
    let disposedCount = 0;
    function ExampleApp() {
      const [state, setState] = useState(true);
      useEffect(() => {
        setState(false);
      }, []);

      useDisposableMemo(
        () => undefined,
        () => {
          disposedCount += 1;
        },
        [state],
      );

      return null;
    }

    render((
      <StrictMode>
        <ExampleApp />
      </StrictMode>
    ));

    jest.advanceTimersByTime(16);

    expect(disposedCount).toBe(2);
  });
  it('should not run disposal when dependencies are the same during re-render', () => {
    let disposedCount = 0;
    function ExampleApp() {
      const [, setState] = useState(true);
      useEffect(() => {
        setState(false);
      }, []);

      useDisposableMemo(
        () => undefined,
        () => {
          disposedCount += 1;
        },
      );

      return null;
    }

    render((
      <StrictMode>
        <ExampleApp />
      </StrictMode>
    ));

    jest.advanceTimersByTime(16);

    expect(disposedCount).toBe(1);
  });
});
