import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale = 'fa' }) => {
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
}); 