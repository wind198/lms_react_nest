import useApiHttpClient from '@/composables/useHttpClient'
import { ISearchParams } from '@/stores/query'
import {
  IHasId,
  IHasResource,
  IPaginatedData,
  IQueryListParamsAsRefs,
} from '@/lib/types/common.type'
import { IGeneration } from '@/lib/types/entities/generation.entity'
import {
  DEFAULT_ORDER,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from '@/utils/constants'
import { apiPrefix } from '@/utils/helpers'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { isEmpty, set } from 'lodash-es'

type ISearchParamsFilter = ISearchParams['filter']

type IUseGetListOptions = IHasResource &
  Partial<IQueryListParamsAsRefs> & {
    generateAugmentedFilter?: (filter: ISearchParamsFilter) => {}
  }

const defaultAugmentedFilterGenerator = (filter: ISearchParamsFilter) => {
  if (isEmpty(filter)) {
    return {}
  }

  const augmentedFilter = {} as Record<string, any>

  for (const k in filter) {
    const element = filter[k]
    if (['created_at'].includes(k)) {
      const { gte, lte } = element
      Object.entries({ gte, lte })
        .filter((x) => x[1])
        .forEach(([x, y]) => {
          if (x === 'gte') {
            y = dayjs(y).startOf('day').toDate()
          } else {
            y = dayjs(y).endOf('day').toDate()
          }
          set(augmentedFilter, [k, x], y)
        })
    } else {
      augmentedFilter[k] = element
    }
  }

  return augmentedFilter
}

export default function useGetList<T = IHasId>(options: IUseGetListOptions) {
  const {
    resource,
    filter,
    order,
    order_by,
    page,
    per_page,
    resourcePlural = resource + 's',
    generateAugmentedFilter = defaultAugmentedFilterGenerator,
  } = options

  const { $get } = useApiHttpClient()

  const fetchListPaging = async () => {
    const augmentedFilter = generateAugmentedFilter(filter?.value ?? {})
    const { data } = await $get<IPaginatedData<IGeneration>>(
      apiPrefix(resourcePlural),
      {
        params: {
          order: order?.value ?? DEFAULT_ORDER,
          order_by: order_by?.value ?? DEFAULT_ORDER_BY,
          page: page?.value ?? DEFAULT_PAGE,
          per_page: per_page?.value ?? DEFAULT_PER_PAGE,
          filter: augmentedFilter ?? {},
        },
      }
    )

    return data
  }

  const data = useQuery<IPaginatedData<T>, AxiosError, IPaginatedData<T>>({
    queryKey: [
      'generations',
      {
        filter,
        order,
        order_by,
        page,
        per_page,
      },
    ],
    queryFn: fetchListPaging,
    placeholderData: keepPreviousData,
  })

  return { ...data }
}
