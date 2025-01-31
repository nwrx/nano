<template>
  <!-- Search bar with icon -->
  <div
    class="
    flex items-center rd h-8 px-sm space-x-sm
    bg-layout border-1 border-layout hover:border-layout-subtle
    transition group
  ">

    <!-- Search icon -->
    <BaseIcon
      class="w-6 h-6 opacity-80"
      icon="i-carbon:search"
    />

    <!-- Search box -->
    <input
      type="text"
      placeholder="Search..."
      class="
        w-full h-8 px-2 outline-none
        bg-transparent text-white
      "
    />

    <!-- Keybind -->
    <Keybind
      class="
        opacity-0 group-hover:opacity-100
        transition-all duration-200
      "
      label="Ctrl + K"
      icon="i-carbon:keyboard"
    />
  </div>
</template>
