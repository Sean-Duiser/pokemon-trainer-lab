<template>
  <section class="grid gap-10">
    <!-- Hero -->
    <div class="text-center">
      <p class="text-sm uppercase tracking-widest text-zinc-400">Trainer Lab</p>
      <h1 class="mt-2 text-4xl md:text-5xl font-extrabold">Welcome to your Trainer Lab</h1>
      <p class="mt-3 text-zinc-300 max-w-2xl mx-auto">
        Raichu is ready to assist. Choose a room to begin your research.
      </p>

      <div class="mt-6 flex items-center justify-center gap-3">
        <RouterLink
          to="/dex"
          class="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-yellow-400 text-zinc-900 font-semibold hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          Open Pokédex
        </RouterLink>
        <RouterLink
          to="/teams"
          class="inline-flex items-center gap-2 rounded-lg px-4 py-2 border border-zinc-800 text-zinc-200 hover:bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          Build a Team
        </RouterLink>
      </div>
    </div>

    <!-- Rooms -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        to="/dex"
        class="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900 hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <div class="text-2xl">📚</div>
        <h3 class="mt-2 text-lg font-semibold">Pokédex Room</h3>
        <p class="mt-1 text-sm text-zinc-300">Browse, search, and filter Pokémon with species data.</p>
      </RouterLink>

      <RouterLink
        to="/teams"
        class="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900 hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <div class="text-2xl">🧪</div>
        <h3 class="mt-2 text-lg font-semibold">Team Room</h3>
        <p class="mt-1 text-sm text-zinc-300">Assemble six-Pokémon teams and analyze type coverage.</p>
      </RouterLink>

      <RouterLink
        to="/games"
        class="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900 hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <div class="text-2xl">🎮</div>
        <h3 class="mt-2 text-lg font-semibold">Training Zone</h3>
        <p class="mt-1 text-sm text-zinc-300">Memory Flip and Trivia to level up your knowledge.</p>
      </RouterLink>

      <RouterLink
        to="/battle"
        class="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900 hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <div class="text-2xl">⚔️</div>
        <h3 class="mt-2 text-lg font-semibold">Battle Chamber</h3>
        <p class="mt-1 text-sm text-zinc-300">Type calculator and damage sandbox (sim later).</p>
      </RouterLink>

      <RouterLink
        to="/tcg"
        class="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900 hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <div class="text-2xl">🗂️</div>
        <h3 class="mt-2 text-lg font-semibold">Card Archive</h3>
        <p class="mt-1 text-sm text-zinc-300">Search TCG cards and (later) build decks.</p>
      </RouterLink>

      <RouterLink
        to="/profile"
        class="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900 hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <div class="text-2xl">🔬</div>
        <h3 class="mt-2 text-lg font-semibold">Research Office</h3>
        <p class="mt-1 text-sm text-zinc-300">Avatar, badges, saved teams, scores, and settings.</p>
      </RouterLink>
    </div>
  </section>
</template>
