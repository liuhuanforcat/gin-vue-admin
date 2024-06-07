import { Ref, ref } from 'vue';

interface RequestOptions<T> {
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  data: Ref<T | null>;
  run?: (params?: any) => Promise<T | void>;
}

/**
 * 自定义hook，用于发送请求，返回请求数据data,error请求错误体，loadding异步请求loadding
 * @param fetchFunction 请求函数
 * @param manual 控制是否手动触发
 * @returns
 */
export function useRequest<T>(fetchFunction: (params?: any) => Promise<T>, manual: boolean = false): RequestOptions<T> {
  const data = ref<any>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  const run = async (params?: any): Promise<T | void> => {
    try {
      loading.value = true;
      data.value = await fetchFunction(params);
      return data.value;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  if (!manual) {
    // 自动触发请求
    run();
  }

  return {
    data,
    error,
    loading,
    ...(manual && { run }) // 仅在手动模式下返回 run 方法
  };
}


