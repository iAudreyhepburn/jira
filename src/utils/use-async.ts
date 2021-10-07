import { useCallback, useState } from "react";
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

export const useAsync = <D>(initialState?: State<D>, initialConfig?: typeof defaultConfig) => {
  const config = { ...defaultConfig, initialConfig };
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState
  })

  const mountedRef = useMountedRef()

  const setData = useCallback((data: D) => setState({
    data,
    stat: 'success',
    error: null
  }), [])

  const setError = useCallback((error: Error) => setState({
    error,
    stat: 'error',
    data: null
  }), [])

  //run用来触发异步请求
  const run = useCallback((promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error("请传入 Promise 类型数据");
    }
    // setState({ ...state, stat: 'loading' });
    setState(prevState => ({ ...prevState, stat: 'loading' }));
    return promise.then(data => {
      //判断不要在卸载完之后再设置数据
      if (mountedRef.current)
        setData(data);
      return data;
    }).catch(error => {
      //catch会消化异常，如果不主动抛出，外面是接收不到异常的
      setError(error);
      if (config.throwOnError) return Promise.reject(error);
      return Promise.reject(error);
    })
  }, [config.throwOnError, mountedRef, setData, setError])

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    ...state
  }
}