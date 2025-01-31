<template>
  <div
    class="
      flex items-center justify-start space-x-2
      w-full text-start outline-none
      border appearance-none rounded
      transition-colors duration-200
      placeholder-black/50

      bg-transparent
      hover:bg-black/5

      border-transparent
      hover:border-black/10
    ">

    <!-- Field -->
    <slot />
  </div>
</template>
