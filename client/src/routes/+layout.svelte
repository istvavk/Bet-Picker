<script lang="ts">
  import "../app.css";
  import { navigating, page } from "$app/stores";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { writableToPromise } from "$lib/writable";
  import { authUser } from "$lib/state";

  const PUBLIC_ROUTES = [];
  const UNAUTHENTICATED_ROUTES = [
    '/sign-in',
    '/sign-up',
    '/forgot-password'
  ];

  let loading = true;

  $: if (!$navigating && browser) checkRoute();

  $: if (browser && $authUser?.uid) checkRoute();

  async function checkRoute() {
    loading = true;

    const route = $page?.route?.id;

    if (!route) {
      loading = false;
      return;
    }

    if (PUBLIC_ROUTES.includes(route)) {
      loading = false;
      return;
    }

    const isUnauthenticatedRoute = UNAUTHENTICATED_ROUTES.includes(route);
    const isAuthenticated = await writableToPromise(authUser);

    if (isUnauthenticatedRoute) {
      if (isAuthenticated) {
        await goto('/');
        return;
      }

      loading = false;
      return;
    }

    if (!isAuthenticated) {
      await goto('/sign-in');
      loading = false;
      return;
    }

    loading = false;
  }
</script>

{#if loading}
    <div class="flex justify-center items-center w-full h-screen">
        <div class="loader ease-linear rounded-full border-4 border-t-4 border-orange-500 h-16 w-16 animate-spin"></div>
    </div>
{:else}
    <slot />
{/if}

<style>
    .loader {
        border-top-color: #ff5722;
    }
</style>
