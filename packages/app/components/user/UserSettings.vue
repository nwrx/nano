<template>
  <AppPage class="flex flex-col overflow-hidden w-full bg-white space-y-8">
    <!--
      <AppPageHeader
      icon="i-carbon:settings"
      title="User Settings"
      description="Update your account settings."
      />
    -->

    <!-- Side menu -->
    <AppPageContainer contained>
      <div class="flex w-full h-full gap-16">
        <AppPageNav :groups="NAV_USER_SETTINGS" class="h-full shrink"/>

        <!-- Content -->
        <div class="w-full">
          <slot/>
        </div>
      </div>
    </AppPageContainer>
  </AppPage>
</template>
