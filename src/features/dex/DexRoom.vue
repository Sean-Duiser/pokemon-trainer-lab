<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { usePokeApi } from "../../composables/usePokeApi";
import { getIdFromUrl, artworkUrl, typeColor, spriteThumbUrl } from "./utils";

const rawQ = ref("");
const q = ref("");
let qTimer: number | undefined;

watch(rawQ, (v) => {
  if (qTimer) clearTimeout(qTimer);
  qTimer = window.setTimeout(() => (q.value = v), 150);
});

// ---------- Types ----------
type ListResult = { name: string; url: string };
type PokeListResponse = { results: ListResult[]; next: string | null; previous: string | null };

type Pokemon = {
  id: number;
  name: string;
  sprites?: any;
  types: { slot: number; type: { name: string; url: string } }[]; // not optional
  stats?: { base_stat: number; stat: { name: string } }[];
};


// ---------- Composable ----------
const { get, loading, error } = usePokeApi();

// ---------- State ----------
const items = ref<Pokemon[]>([]);
const nextUrl = ref<string | null>("https://pokeapi.co/api/v2/pokemon?limit=30&offset=0");

// Detail
const selected = ref<Pokemon | null>(null);
const speciesText = ref<string>("");

// Infinite scroll
const sentinel = ref<HTMLElement | null>(null);
let io: IntersectionObserver | null = null;
let inflight = false;

// Type filters (multi-select)
const typeOptions = ref<string[]>([]);
const activeTypes = ref<Set<string>>(new Set());

// ---------- Helpers ----------
function isActiveType(t: string) {
  return activeTypes.value.has(t);
}
function toggleType(t: string) {
  const next = new Set(activeTypes.value);
  next.has(t) ? next.delete(t) : next.add(t);
  activeTypes.value = next;
}
function clearTypes() {
  activeTypes.value = new Set();
}

// Load master type list
async function loadTypes() {
  const res = await get<any>("/type");
  typeOptions.value = (res.results || [])
    .map((x: any) => x.name)
    .filter((n: string) => n !== "unknown" && n !== "shadow")
    .sort();
}

async function ensureTypesForVisible(limit = 60, concurrency = 6) {
  // 1) Check for empty types array instead of !p.types
  const targets = items.value.filter(p => p.types.length === 0).slice(0, limit);

  let i = 0;
  async function worker() {
    while (i < targets.length) {
      // 2) Guard against undefined from out-of-bounds indexing
      const p = targets[i++];
      if (!p) break;

      try {
        const detail = await get<any>(`/pokemon/${p.id}`);
        p.types = detail.types ?? [];
      } catch {
        // keep it empty on failure so we can retry later
        p.types = p.types ?? [];
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
}

// ---------- Data loading ----------
async function loadMore() {
  if (!nextUrl.value || inflight) return;
  inflight = true;
  try {
    const page = await get<PokeListResponse>(nextUrl.value);
    nextUrl.value = page.next;
    const mapped = page.results.map(r => ({
      id: getIdFromUrl(r.url),
      name: r.name,
      types: []   // satisfy the type
    }));

    items.value.push(...mapped);
    localStorage.setItem(CACHE_KEY, JSON.stringify(items.value));

    nextUrl.value = page.next;
    localStorage.setItem(NEXT_KEY, nextUrl.value ?? "");
    // If filters are on, hydrate some new items' types so matches can appear
    if (activeTypes.value.size > 0) await ensureTypesForVisible(30);
  } finally {
    inflight = false;
  }
}

async function openDetail(p: Pokemon) {
  const full = await get<Pokemon>(`/pokemon/${p.id}`);
  selected.value = { ...p, ...full };

  try {
    const sp = await get<any>(`/pokemon-species/${p.id}`);
    const en = (sp.flavor_text_entries || []).find((e: any) => e.language?.name === "en");
    speciesText.value = en ? String(en.flavor_text).replace(/\s+/g, " ") : "";
  } catch {
    speciesText.value = "";
  }
}

function closeDetail() {
  selected.value = null;
  speciesText.value = "";
}

function clearDexCache() {
  localStorage.removeItem("dex:list:v1");
  localStorage.removeItem("dex:nextUrl:v1");
  items.value = [];
  nextUrl.value = "https://pokeapi.co/api/v2/pokemon?limit=30&offset=0";
}

// ---------- Derived ----------
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  let base = items.value;

  if (term) {
    base = base.filter((p) => p.name.includes(term) || String(p.id) === term);
  }

  const selectedTypes = Array.from(activeTypes.value);
  if (selectedTypes.length === 0) return base;

  // Require ALL selected types to be present
  return base.filter(
    (p) => p.types && selectedTypes.every((t) => p.types!.some((tt: any) => tt.type.name === t))
  );
});

// Hydrate types when filters or items change
watch([activeTypes, items], async () => {
  if (activeTypes.value.size === 0) return;   // <- skip when no filter
  await ensureTypesForVisible();
});

const CACHE_KEY = "dex:list:v1";
const NEXT_KEY = "dex:nextUrl:v1";

const cachedList = localStorage.getItem(CACHE_KEY);
if (cachedList) {
  try { items.value = JSON.parse(cachedList); } catch { items.value = []; }
}

const cachedNext = localStorage.getItem(NEXT_KEY);
if (cachedNext) nextUrl.value = cachedNext;

// ---------- Lifecycle ----------
onMounted(async () => {
  // Only fetch if we didn't hydrate from cache
  if (items.value.length === 0) {
    await loadMore();
  }

  loadTypes();

  io = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !q.value) {
          loadMore();
        }
      }
    },
    { root: null, rootMargin: "1200px", threshold: 0 }
  );

  if (sentinel.value) io.observe(sentinel.value);
});

onBeforeUnmount(() => {
  if (io && sentinel.value) io.unobserve(sentinel.value);
  io = null;
});
</script>

<template>
  <section class="grid gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">Pokédex Room</h2>
        <p class="text-zinc-300">Browse and research Pokémon species.</p>
      </div>

      <!-- Dev-only clear cache button -->
      <button class="rounded-md border border-red-600 px-3 py-1 text-sm text-red-400 hover:bg-red-900/40"
        @click="clearDexCache">
        Clear Cache
      </button>
    </div>

    <!-- Search + manual load-more -->
    <div class="flex items-center gap-2">
      <input v-model="rawQ" type="search" placeholder="Search by name or ID…"
        class="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-yellow-400" />
      <button
        class="rounded-lg px-3 py-2 bg-zinc-900 border border-zinc-800 text-sm hover:bg-zinc-800 disabled:opacity-50"
        :disabled="!nextUrl || loading || inflight" @click="loadMore"
        title="Manually load more (useful while searching)">
        {{ nextUrl ? (loading || inflight ? "Loading…" : "Load more") : "All loaded" }}
      </button>
    </div>

    <!-- Type Filters (multi-select + colored chips) -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2">
      <!-- Clear -->
      <button class="shrink-0 rounded-full border px-3 py-1 text-xs transition"
        :class="activeTypes.size ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-900' : 'border-yellow-500/60 bg-yellow-400/20 text-yellow-300'"
        @click="clearTypes" title="Clear all type filters">
        All
      </button>

      <!-- Chips -->
      <button v-for="t in typeOptions" :key="t"
        class="shrink-0 rounded-full border px-3 py-1 text-xs capitalize transition" :style="isActiveType(t)
          ? { backgroundColor: typeColor(t), color: '#111', borderColor: 'transparent' }
          : { borderColor: typeColor(t), color: '#e5e5e5' }"
        :class="isActiveType(t) ? 'shadow-sm' : 'hover:bg-zinc-900'" @click="toggleType(t)">
        {{ t }}
      </button>
    </div>

    <!-- Hydration hint -->
    <p v-if="activeTypes.size && !filtered.length && items.length" class="text-xs text-zinc-400">
      Fetching type data… scroll a bit or give it a sec to see matches.
    </p>

    <!-- Error -->
    <div v-if="error" class="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-sm">
      Error: {{ error }}
    </div>

    <!-- Grid -->
    <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <button v-for="p in filtered" :key="p.id"
        class="group text-left rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-900 hover:border-zinc-700 transition"
        @click="openDetail(p)">
        <div class="aspect-square grid place-items-center rounded-lg bg-zinc-950">
          <img :src="spriteThumbUrl(p.id)" :alt="p.name"
            class="w-28 h-28 object-contain transition-transform group-hover:scale-105" loading="lazy" />
        </div>
        <div class="mt-3 flex items-baseline justify-between">
          <div class="font-semibold capitalize">{{ p.name }}</div>
          <div class="text-xs text-zinc-400">#{{ p.id }}</div>
        </div>
      </button>
    </div>

    <!-- Sentinel for infinite scroll -->
    <div v-show="nextUrl" ref="sentinel" class="h-12 grid place-items-center text-sm text-zinc-400" aria-hidden="true">
      {{ loading || inflight ? "Loading…" : "Scroll to load more" }}
    </div>

    <!-- Detail Drawer -->
    <Transition name="dex" mode="out-in">
      <div v-if="selected" class="fixed inset-0 z-50 grid grid-rows-[1fr] bg-black/50" @click.self="closeDetail">
        <div
          class="mx-auto my-10 w-[95vw] max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div class="flex items-center gap-3">
              <img :src="artworkUrl(selected.id)" :alt="selected.name" class="w-12 h-12 object-contain"
                fetchpriority="high" />
              <div>
                <h3 class="font-semibold text-lg capitalize">
                  {{ selected.name }}
                  <span class="text-sm text-zinc-400">#{{ selected.id }}</span>
                </h3>
                <div class="flex gap-2 mt-1">
                  <span v-for="t in selected.types || []" :key="t.type.name"
                    class="px-2 py-0.5 rounded-md text-xs font-medium"
                    :style="{ backgroundColor: typeColor(t.type.name), color: '#111' }">
                    {{ t.type.name }}
                  </span>
                </div>
              </div>
            </div>
            <button class="rounded-md border border-zinc-800 px-3 py-1 text-sm hover:bg-zinc-900" @click="closeDetail">
              Close
            </button>
          </div>

          <div class="p-5 grid gap-4">
            <p v-if="speciesText" class="text-sm text-zinc-300 leading-relaxed">
              {{ speciesText }}
            </p>

            <div v-if="selected.stats?.length" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div v-for="s in selected.stats" :key="s.stat.name" class="rounded-lg border border-zinc-800 p-3">
                <div class="text-xs text-zinc-400 uppercase tracking-wide">
                  {{ s.stat.name.replace('-', ' ') }}
                </div>
                <div class="text-lg font-semibold">{{ s.base_stat }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style>
.dex-enter-from,
.dex-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.dex-enter-active,
.dex-leave-active {
  transition: all 120ms ease;
}
</style>
