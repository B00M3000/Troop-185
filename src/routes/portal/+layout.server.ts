import { redirect } from '@sveltejs/kit';

export const load = async ({ url, parent }) => {
  const upstreamData = await parent();

  if (url.pathname != "/portal/login" && !upstreamData.isAuthenticated) {
    throw redirect(
      307,
      `/portal/login?redirectTo=${encodeURIComponent(url.pathname)}`
    );
  }
};
