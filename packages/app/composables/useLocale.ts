export const useLocale = createGlobalState(() => {
  const { locale, defaultLocale } = useI18n()
  return { locale, defaultLocale }
})
