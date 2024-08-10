<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchOdds, fetchCSVData } from '$lib/api';
  import { toast, Toaster } from 'svelte-french-toast';
  import { preprocessData } from '$lib/preprocessData';
  import { identifyValueBets } from '$lib/valueBets';
  import { Button, Label, Select, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { auth } from '$lib/firebase';

  let odds: any[] = [];
  let csvData: any[] = [];
  let loadingOdds = true;
  let loadingCsv = true;
  let valueBetsPoisson: any[] = [];
  let valueBetsDC: any[] = [];
  let selectedModel = 'Poisson';
  const rho = 0.1; // parametar za Dixon-Coles model

  const models = [
    { value: 'Poisson', name: 'Poisson Model' },
    { value: 'Dixon-Coles', name: 'Dixon-Coles Model' },
  ];

  // recalculate value bets when the model is changed
  $: currentValueBets = selectedModel === 'Poisson' ? valueBetsPoisson : valueBetsDC;


  async function loadData() {
    try {
      console.log('Loading data...');

      odds = await fetchOdds('soccer');
      console.log('Odds fetched:', odds);
      toast.success('Odds fetched successfully');

      const rawData = await fetchCSVData();
      csvData = preprocessData(rawData);
      console.log('CSV Data fetched:', csvData);
      toast.success('CSV data fetched successfully');

      // Identify value bets for both models
      valueBetsPoisson = identifyValueBets(odds, csvData, 0); // Poisson model, rho = 0
      valueBetsDC = identifyValueBets(odds, csvData, rho); // Dixon-Coles model

    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error:', error);
    } finally {
      loadingOdds = false;
      loadingCsv = false;
    }
  }

  // dohvati vjerojatnosti za odredeni model
  function getModelProbabilities(bet) {
    console.log("Current Bet Data for", selectedModel, ":", bet);
    if (selectedModel === 'Poisson') {
      return {
        home: bet.modelProbHome,
        draw: bet.modelProbDraw,
        away: bet.modelProbAway,
      };
    } else {
      return {
        home: bet.dcModelProbHome,
        draw: bet.dcModelProbDraw,
        away: bet.dcModelProbAway,
      };
    }
  }

  onMount(async () => {
    await loadData();
  });
</script>

<Toaster />

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Bet Picker - Dashboard</h1>
        <div class="flex items-center space-x-4">
            <Label class="flex items-center space-x-2">
                <span class="text-lg font-semibold text-gray-600">Select Model:</span>
                <Select items={models} bind:value={selectedModel} />
            </Label>
            <Button on:click={() => auth.signOut()} class="ml-4">Logout</Button>
        </div>
    </div>

    {#if loadingOdds}
        <p class="text-lg text-gray-500">Loading odds...</p>
    {:else if odds.length > 0}
        <Table shadow class="w-full">
            <TableHead class="bg-gray-200">
                <TableHeadCell class="py-3 px-5">Home Team</TableHeadCell>
                <TableHeadCell class="py-3 px-5">Away Team</TableHeadCell>
                <TableHeadCell class="py-3 px-5">Home Odds</TableHeadCell>
                <TableHeadCell class="py-3 px-5">Draw Odds</TableHeadCell>
                <TableHeadCell class="py-3 px-5">Away Odds</TableHeadCell>
            </TableHead>
            <TableBody tableBodyClass="divide-y divide-gray-300">
                {#each odds as odd}
                    <TableBodyRow class="hover:bg-gray-100">
                        <TableBodyCell class="py-3 px-5">{odd.home_team}</TableBodyCell>
                        <TableBodyCell class="py-3 px-5">{odd.away_team}</TableBodyCell>
                        <TableBodyCell class="py-3 px-5">{odd.home_odds}</TableBodyCell>
                        <TableBodyCell class="py-3 px-5">{odd.draw_odds}</TableBodyCell>
                        <TableBodyCell class="py-3 px-5">{odd.away_odds}</TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {:else}
        <p class="text-lg text-gray-500">No odds available</p>
    {/if}

    <h2 class="mt-12 text-2xl font-bold text-gray-800">Value Bets ({selectedModel})</h2>

    {#if loadingCsv}
        <p class="text-lg text-gray-500">Loading CSV data...</p>
    {:else if currentValueBets.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {#each currentValueBets as bet}
                <div class="bg-white shadow-md rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-gray-700">{bet.home_team} vs {bet.away_team}</h3>
                    <p class="mt-2 text-gray-600">
                    </p>
                    <p class="mt-2 text-gray-600">
                        <strong>Home Probability ({selectedModel}):</strong> {getModelProbabilities(bet).home.toFixed(2)}
                    </p>
                    <p class="mt-1 text-gray-600">
                        <strong>Draw Probability ({selectedModel}):</strong> {getModelProbabilities(bet).draw.toFixed(2)}
                    </p>
                    <p class="mt-1 text-gray-600">
                        <strong>Away Probability ({selectedModel}):</strong> {getModelProbabilities(bet).away.toFixed(2)}
                    </p>
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-lg text-gray-500">No value bets found</p>
    {/if}
</div>
