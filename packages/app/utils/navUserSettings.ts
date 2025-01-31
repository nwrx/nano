export const NAV_USER_SETTINGS: NavItem[] = [
  {
    items: [
      {
        label: 'Profile',
        icon: 'i-carbon:user',
        to: { name: 'UserSettingsProfile' },
      },
      {
        label: 'Account',
        icon: 'i-carbon:settings',
        to: { name: 'UserSettingsAccount' },
      },
      {
        label: 'Notifications',
        to: '/settings/notifications',
        icon: 'i-carbon:notification',
      },
      {
        label: 'Customizations',
        to: '/settings/customizations',
        icon: 'i-carbon:paint-brush',
      },
    ],
  },
  {
    label: 'Security',
    items: [
      {
        label: 'Password & MFA',
        icon: 'i-carbon:security',
        to: { name: 'UserSettingsPassword' },
      },
      {
        label: 'Single sign-on',
        to: '/settings/security/api-keys',
        icon: 'i-carbon:credentials',
      },
      {
        label: 'API keys',
        to: '/settings/security/api-keys',
        icon: 'i-carbon:api-key',
      },
      {
        label: 'Sessions',
        icon: 'i-carbon:mobile-session',
        to: { name: 'UserSettingsSessions' },
      },
    ],
  },
  {
    label: 'Billing',
    items: [
      {
        label: 'Upgrade',
        to: '/settings/billing/upgrade',
        icon: 'i-carbon:upgrade',
      },
      {
        label: 'Plan & subscription',
        to: '/settings/billing/subscription',
        icon: 'i-carbon:subscription',
      },
      {
        label: 'Invoices',
        to: '/settings/billing/invoices',
        icon: 'i-carbon:document-multiple-01',
      },
      {
        label: 'Usage',
        to: '/settings/billing/usage',
        icon: 'i-carbon:analytics',
      },
      {
        label: 'Payment methods',
        to: '/settings/billing/payment-methods',
        icon: 'i-carbon:money',
      },
    ],
  },
  {
    label: 'Support',
    items: [
      {
        label: 'Help center',
        to: '/settings/support/help-center',
        icon: 'i-carbon:help',
      },
      {
        label: 'Contact support',
        to: '/settings/support/contact',
        icon: 'i-carbon:chat',
      },
      {
        label: 'Direct chat',
        to: '/settings/support/chat',
        icon: 'i-carbon:chat-bot',
      },
    ],
  },
]
