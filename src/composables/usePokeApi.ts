import { ref } from "vue";

type Json = Record<string, any>;

const BASE = "https://pokeapi.co/api/v2";
const cache = new Map<string, any>();

export function usePokeApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function get<T = Json>(path: string): Promise<T> {
    const url = path.startsWith("http") ? path : `${BASE}${path}`;
    if (cache.has(url)) return cache.get(url);
    loading.value = true; error.value = null;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json() as T;
      cache.set(url, data);
      return data;
    } catch (e: any) {
      error.value = e?.message ?? "Unknown error";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return { get, loading, error };
}
