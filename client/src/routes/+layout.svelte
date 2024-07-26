<script lang="ts">
  import "../app.css";
  import {navigating, page} from "$app/stores";
  import {browser} from "$app/environment";
  import {goto} from "$app/navigation";
  import {writableToPromise} from "$lib/writable";
  import {authUser} from "$lib/state";

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

    console.log(1, loading);

    const route = $page?.route?.id;

    if (!route) {
      console.log(2, route);
      loading = false;
      return;
    }

    if (PUBLIC_ROUTES.includes(route)) {
      console.log(3, route);
      loading = false;
      return;
    }

    const isUnauthenticatedRoute = UNAUTHENTICATED_ROUTES.includes(route);
    const isAuthenticated = await writableToPromise(authUser);

    if (isUnauthenticatedRoute) {
      if (isAuthenticated) {
        console.log(4, route);
        await goto('/');
        return;
      }

      console.log(5, route);
      loading = false;
      return;
    }

    if (!isAuthenticated) {
      console.log(6, route);
      await goto('/sign-in');
      loading = false;
      return;
    }

    console.log(7, route);
    loading = false;
  }
</script>

{#if loading}
    <div class="flex justify-center items-center w-full h-full">
        <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
    </div>
{:else}
    <slot />
{/if}
