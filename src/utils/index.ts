import { useEffect, useState } from "react";

export const isFalsy = (value: unknown) => value === 0 ? false : !value;

//在一个函数里，改变传入的对象本身是不好的
export const cleanObject = (object: Object) => {
  const result = { ...object };
  Object.keys(object).forEach(key => {
    //@ts-ignore   表示这里有错误，但是被压制了，所以不报错
    const value = result[key];
    if (isFalsy(value)) {
      //@ts-ignore
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
    callback()
  }, [])
}
