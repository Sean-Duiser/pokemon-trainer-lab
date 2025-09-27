<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
    <!-- Sticky header -->
    <header class="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <nav class="max-w-6xl mx-auto flex items-center justify-between p-4">
        <RouterLink to="/" class="flex items-center gap-2 font-semibold text-yellow-400 hover:text-yellow-300">
          <span>Trainer Lab</span><span aria-hidden>⚡</span>
        </RouterLink>

        <ul class="flex items-center gap-1">
          <li><RouterLink :class="linkClass" to="/dex" class="px-3 py-1 rounded-md text-sm text-zinc-300 hover:text-yellow-300 hover:bg-zinc-900" active-class="bg-zinc-800 text-yellow-300">Pokédex</RouterLink></li>
          <li><RouterLink :class="linkClass" to="/teams" class="px-3 py-1 rounded-md text-sm text-zinc-300 hover:text-yellow-300 hover:bg-zinc-900" active-class="bg-zinc-800 text-yellow-300">Teams</RouterLink></li>
          <li><RouterLink :class="linkClass" to="/games" class="px-3 py-1 rounded-md text-sm text-zinc-300 hover:text-yellow-300 hover:bg-zinc-900" active-class="bg-zinc-800 text-yellow-300">Training</RouterLink></li>
          <li><RouterLink :class="linkClass" to="/battle" class="px-3 py-1 rounded-md text-sm text-zinc-300 hover:text-yellow-300 hover:bg-zinc-900" active-class="bg-zinc-800 text-yellow-300">Battle</RouterLink></li>
          <li><RouterLink :class="linkClass" to="/tcg" class="px-3 py-1 rounded-md text-sm text-zinc-300 hover:text-yellow-300 hover:bg-zinc-900" active-class="bg-zinc-800 text-yellow-300">TCG</RouterLink></li>
          <li><RouterLink :class="linkClass" to="/profile" class="px-3 py-1 rounded-md text-sm text-zinc-300 hover:text-yellow-300 hover:bg-zinc-900" active-class="bg-zinc-800 text-yellow-300">Profile</RouterLink></li>
        </ul>
      </nav>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-10">
      <Transition name="room" mode="out-in">
        <RouterView />
      </Transition>
    </main>

    <footer class="max-w-6xl mx-auto px-4 py-8 text-xs text-zinc-400">
      Fan-made, non-commercial project for educational purposes. Not affiliated with Nintendo, Game Freak, or The Pokémon Company.
    </footer>
  </div>
</template>

<script setup lang="ts">
const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "nav-link",
    isActive ? "nav-link--active" : "nav-link--idle"
  ].join(" ");
</script>

<style>
.room-enter-from, .room-leave-to { opacity: 0; transform: translateY(6px); }
.room-enter-active, .room-leave-active { transition: all 160ms ease; }
</style>
