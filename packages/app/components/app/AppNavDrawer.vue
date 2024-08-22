<script setup lang="ts">
import type { NavItem } from '~/utils/types'

const props = defineProps<{
  items: NavItem[]
}>()
</script>

<template>
  <div>

    <!-- Navitems -->
    <nav>
      <ul>
        <li
          v-for="(item, index) in props.items"
          :key="index"
          class="bg-gray-200">

          <NuxtLink :to="item.to">
            {{ item.text }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
