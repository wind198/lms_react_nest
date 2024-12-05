import useApiHttpClient from '@/composables/useHttpClient'
import { apiPrefix, getManyUrl, getOneUrl } from '@/utils/helpers'
import { useQuery } from '@tanstack/vue-query'
import { AxiosError } from 'axios'

type IOptions = {
  ids: Ref<number[]>
  resource: string
  resourcePlular?: string
}

export default function useGetMany<T>(options: IOptions) {
  const { ids, resource, resourcePlular = resource + 's' } = options

  const { $get } = useApiHttpClient()

  const getOne = async () => {
    if (!ids.value) {
      throw new Error(`Invalid ids: ${ids.value}`)
    }
    const { data } = await $get(getManyUrl(resourcePlular), {
      params: {
        ids: ids.value,
      },
    })
    return data
  }

  const res = useQuery<T, AxiosError, T>({
    queryKey: [resourcePlular, 'getMany', { ids }],
    queryFn: getOne,
  })

  return res
}
