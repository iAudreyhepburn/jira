import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "utils";
interface State<D> {
  error: Error | null,
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState: State<null> = {
  stat: 'idle',
  data: null,
  error: null
}

const defaultConfig = {
  throwOnError: false
}

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback((...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0), [dispatch, mountedRef])
}

// 用reducer改造
export const useAsync = <D>(initialState?: State<D>, initialConfig?: typeof defaultConfig) => {
  const config = { ...defaultConfig, initialConfig };
  const [state, dispatch] = useReducer((state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }), {
    ...defaultInitialState,
    ...initialState
  })
  const [retry, setRetry] = useState(() => () => {

  })

  const safeDispatch = useSafeDispatch(dispatch)

  const setData = useCallback((data: D) => safeDispatch({
    data,
    stat: 'success',
    error: null
  }), [safeDispatch])

  const setError = useCallback((error: Error) => safeDispatch({
    error,
    stat: 'error',
    data: null
  }), [safeDispatch])

  //run用来触发异步请求
  const run = useCallback((promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
    if (!promise || !promise.then) {
      throw new Error("请传入 Promise 类型数据");
    }
    setRetry(() => () => {
      if (runConfig?.retry) {

        run(runConfig?.retry(), runConfig)
      }
    })
    // setState({ ...state, stat: 'loading' });
    safeDispatch({ stat: 'loading' });
    return promise.then(data => {
      setData(data);
      return data;
    }).catch(error => {
      //catch会消化异常，如果不主动抛出，外面是接收不到异常的
      setError(error);
      if (config.throwOnError) return Promise.reject(error);
      return Promise.reject(error);
    })
  }, [config.throwOnError, setData, setError, safeDispatch])

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    //retry被调用时重新跑一遍run, 让state刷新一遍
    retry,
    ...state
  }
}