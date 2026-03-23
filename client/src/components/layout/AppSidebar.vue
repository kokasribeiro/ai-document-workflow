<template>
  <aside class="hidden w-64 border-r border-white/40 bg-white/70 p-4 backdrop-blur md:block">
    <nav class="space-y-2">
      <RouterLink
        class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700"
        to="/"
      >
        Dashboard
      </RouterLink>
      <RouterLink
        class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700"
        to="/documents"
      >
        Documents
      </RouterLink>
      <RouterLink
        class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700"
        to="/documents/new"
      >
        New Document
      </RouterLink>
      <RouterLink
        class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-700"
        to="/profile"
      >
        My Profile
      </RouterLink>
    </nav>
  </aside>
</template>
