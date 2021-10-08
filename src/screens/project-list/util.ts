import { useMemo } from "react";
import { useUrlQueryParam } from "utils/url";

//项目列表搜索的参数
export const useProjectSearchParams = () => {
  //param直接从url中得到的所有数据都是string类型的
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  //解决上述问题
  return [
    useMemo(
      () => ({
        ...param,
        personId: Number(param.personId) || undefined,
      }),
      [param]
    ),
    setParam
  ] as const
}

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    'projectCreate'
  ])

  const open = () => setProjectCreate({ projectCreate: true })
  const close = () => setProjectCreate({ projectCreate: undefined })

  return {
    projectModalOpen: projectCreate === 'true',
    open,
    close
  }
}