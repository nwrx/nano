<template>
  <AppPage class="flex flex-col overflow-hidden w-full space-y-8">
    <AppPageHeader
      icon="i-carbon:settings"
      title="User Settings"
      description="Update your account settings."
    />

    <!-- Side menu -->
    <AppPageContainer class="bg-white grow">
      <div class="flex w-full gap-16">
        <AppPageNav :groups="NAV_USER_SETTINGS" class="shrink"/>

        <!-- Content -->
        <div>
          <slot/>
        </div>
      </div>
    </AppPageContainer>
  </AppPage>
</template>
