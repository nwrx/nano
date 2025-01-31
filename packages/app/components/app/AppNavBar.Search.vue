<template>
  <!-- Search bar with icon -->
  <div
    class="
    flex items-center rounded
    h-8 px-2 space-x-2
    bg-primary-900
    ring-1 ring-primary-200/20
    hover:ring-primary-200/40
    transition-all duration-200
    group
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
