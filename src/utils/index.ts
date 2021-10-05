import { useEffect, useRef, useState } from "react";

export const isFalsy = (value: unknown) => value === 0 ? false : !value;

export const isVoid = (value: unknown) => value === undefined || value === null || value === '';
// let b: { [key: string]: unknown }
// b = { name: "ja", ds: "sdf" }
//在一个函数里，改变传入的对象本身是不好的
export const cleanObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };
  Object.keys(object).forEach(key => {

    const value = result[key];
    if (isVoid(value)) {

      delete result[key];
    }
  })
  return result;
}
//输入框去抖                                                
export const useDebounce = <V>(value: V, delay?: number) => { //?代表可无，要么不传，要么传number类型
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay])
  return debouncedValue;
}
//初始化封装
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    //TODO 依赖项里加上callback会造成无限循环，这个和useCallback以及useMemo 有关系
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useDocumentTitle = (title: string, keepOnUnmount: boolean = true) => {
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title;
  }, [title]);
  //将要卸载的时候
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    }
  }, [keepOnUnmount, oldTitle])
}

//重置路由，刷新页面
export const resetRoute = () => window.location.href = window.location.origin;