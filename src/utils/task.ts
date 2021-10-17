import { QueryKey, useMutation, useQuery } from "react-query";
import { Project } from "types/Project";
import { Task } from "types/task";
import { useHttp } from 'utils/http'
import { SortProps } from "./kanban";
import { useAddConfig, useDeleteConfig, useEditConfig, useReorderConfig } from "./use-optimistic-options";


export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[]>(['tasks', param], () => client('tasks', { data: param }))

}

export const useAddTask = (queryKey: QueryKey) => {

  const client = useHttp();

  return useMutation((params: Partial<Task>) =>
    client(`tasks`, {
      data: params,
      method: 'POST'
    }),
    useAddConfig(queryKey)
  )
}

export const useTask = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ['task', { id }],
    () => client(`tasks/${id}`),
    {
      enabled: Boolean(id)
    }
  )
}

export const useEditTask = (queryKey: QueryKey) => {

  const client = useHttp();

  return useMutation((params: Partial<Task>) => client(`tasks/${params.id}`, {
    method: 'PATCH',
    data: params
  }),
    useEditConfig(queryKey)
  )
}

export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(({ id }: { id: number }) =>
    client(`tasks/${id}`, {
      method: 'DELETE'
    }),
    useDeleteConfig(queryKey)
  )
}

export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: SortProps) => {
      return client('tasks/reorder', {
        data: params,
        method: 'POST'
      })
    },
    useReorderConfig(queryKey)
  )
}