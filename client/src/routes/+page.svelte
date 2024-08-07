<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchOdds, fetchCSVData } from '$lib/api';
  import { toast, Toaster } from 'svelte-french-toast';
  import { preprocessData } from '$lib/preprocessData';
  import { identifyValueBets } from '$lib/valueBets';

  let odds: any[] = [];
  let csvData: any[] = [];
  let sport = 'soccer';
  let loadingOdds = true;
  let loadingCsv = true;
  let valueBets: any[] = [];

  onMount(async () => {
    try {
      console.log('onMount called');

      // Fetching odds
      odds = await fetchOdds(sport);
      console.log('Odds fetched:', odds);
      toast.success('Odds fetched successfully');

      // Fetching CSV data
      const rawData = await fetchCSVData();
      csvData = preprocessData(rawData);
      console.log('CSV Data fetched:', csvData);
      toast.success('CSV data fetched successfully');

      // Calculate averages for Poisson model
      const avgGoalsHome = csvData.length > 0 ? csvData.reduce((sum, game) => sum + game.goals_home, 0) / csvData.length : 0;
      const avgGoalsAway = csvData.length > 0 ? csvData.reduce((sum, game) => sum + game.goals_away, 0) / csvData.length : 0;

      console.log('Average Goals Home:', avgGoalsHome);
      console.log('Average Goals Away:', avgGoalsAway);

      // Identify value bets
      valueBets = identifyValueBets(odds, csvData, avgGoalsHome, avgGoalsAway, 0.1);
      console.log('Value Bets:', valueBets);

    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error:', error);
    } finally {
      loadingOdds = false;
      loadingCsv = false;
    }
  });
</script>

<Toaster />

<!-- Displaying odds -->
{#if loadingOdds}
    <p>Loading odds...</p>
{:else}
    {#if odds.length > 0}
        <h2>Odds</h2>
        <ul>
            {#each odds as odd}
                <li>{odd.home_team} vs {odd.away_team}: Home {odd.home_odds}, Draw {odd.draw_odds}, Away {odd.away_odds}</li>
            {/each}
        </ul>
    {:else}
        <p>No odds available</p>
    {/if}
{/if}

<!-- Displaying value bets -->
{#if loadingCsv}
    <p>Loading CSV data...</p>
{:else}
    {#if valueBets.length > 0}
        <h2>Value Bets</h2>
        <ul>
            {#each valueBets as bet}
                <li>
                    {bet.home_team} vs {bet.away_team}:
                    Home {bet.home_odds} (Model: {bet.modelProbHome.toFixed(2)}, DC Model: {bet.dcModelProbHome.toFixed(2)}),
                    Draw {bet.draw_odds} (Model: {bet.modelProbDraw.toFixed(2)}, DC Model: {bet.dcModelProbDraw.toFixed(2)}),
                    Away {bet.away_odds} (Model: {bet.modelProbAway.toFixed(2)}, DC Model: {bet.dcModelProbAway.toFixed(2)})
                </li>
            {/each}
        </ul>
    {:else}
        <p>No value bets found</p>
    {/if}
{/if}
