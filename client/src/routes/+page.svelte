<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchOdds } from '$lib/api';  // Koristimo alias $lib
  import { toast, Toaster } from 'svelte-french-toast';
  import { Button } from 'flowbite-svelte';
  import {goto} from "$app/navigation";
  import {auth} from "$lib/firebase";

  let odds = [];
  let sport = 'soccer'; // Primjer sporta
  let loading = true;

  onMount(async () => {
    try {
      console.log('onMount called');
      odds = await fetchOdds(sport);
      console.log('Odds fetched:', odds);
      toast.success('Data fetched successfully');
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      loading = false;
    }
  });
</script>

<Toaster />

{#if loading}
    <p>Loading...</p>
{:else}
    {#if odds.length > 0}
        <ul>
            {#each odds as odd}
                <li>{odd.away_team} vs {odd.home_team}</li>
            {/each}
        </ul>
    {:else}
        <p>No odds available</p>
    {/if}
{/if}


<Button on:click={() => goto('/sign-in')}>Login</Button>
<Button on:click={() => auth.signOut()}>Logout</Button>
