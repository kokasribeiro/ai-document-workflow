<template>
  <aside class="hidden w-64 border-r bg-white p-4 md:block">
    <nav class="space-y-2">
      <RouterLink class="block rounded px-3 py-2 hover:bg-slate-100" to="/">
        Dashboard
      </RouterLink>
      <RouterLink class="block rounded px-3 py-2 hover:bg-slate-100" to="/documents">
        Documents
      </RouterLink>
      <RouterLink class="block rounded px-3 py-2 hover:bg-slate-100" to="/documents/new">
        New Document
      </RouterLink>
    </nav>
  </aside>
</template>
