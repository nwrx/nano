<template>
  <div
    class="
      flex items-center justify-start space-x-2
      w-full text-start outline-none
      border appearance-none rounded
      transition-colors duration-200
      placeholder-black/50

      bg-primary-500/0
      hover:bg-primary-500/5

      border-transparent
      hover:border-primary-200
    ">

    <!-- Field -->
    <slot />
  </div>
</template>
