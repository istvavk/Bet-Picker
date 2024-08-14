<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchOdds, fetchCSVData } from '$lib/api';
  import { toast, Toaster } from 'svelte-french-toast';
  import { preprocessData } from '$lib/preprocessData';
  import { identifyValueBets } from '$lib/valueBets';
  import {
    Button,
    Card,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Label,
    Input } from 'flowbite-svelte';
  import { auth } from '$lib/firebase';

  let odds: any[] = [];
  let csvData: any[] = [];
  let loadingOdds = true;
  let loadingCsv = true;
  let valueBets: any[] = [];
  let profit = 0;
  let wager = 100;

  function calculateProfit() {
    profit = 0;
    valueBets.forEach(bet => {
      let betProfit = 0;
      if (bet.isValueBetHome) {
        betProfit += (bet.modelProbHome * bet.home_odds * wager) - wager;
      }
      if (bet.isValueBetDraw) {
        betProfit += (bet.modelProbDraw * bet.draw_odds * wager) - wager;
      }
      if (bet.isValueBetAway) {
        betProfit += (bet.modelProbAway * bet.away_odds * wager) - wager;
      }
      bet.profit = betProfit; // za pojedinacni bet
      profit += betProfit; // ukupni
    });
  }

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

      valueBets = identifyValueBets(odds, csvData);

      // profit za 100€
      calculateProfit();

    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error:', error);
    } finally {
      loadingOdds = false;
      loadingCsv = false;
    }
  }


  onMount(async () => {
    await loadData();
  });

  // opet racunaj profit kad korisnik unese novu uplatu
  $: if (wager >= 0) {
    calculateProfit();
  }
</script>

<Toaster />

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Bet Picker - Dashboard</h1>
        <div class="flex items-center space-x-4">
            <Button on:click={() => auth.signOut()} class="ml-4">Logout</Button>
        </div>
    </div>

    <div class="mb-6">
        <Label for="wager" class="mb-2 block">Enter your wager (€)</Label>
        <Input id="wager" type="number" min="1" bind:value={wager} class="w-48" placeholder="100" />
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

    <h2 class="mt-12 text-2xl font-bold text-gray-800">Value Bets (Poisson Model)</h2>

    {#if loadingCsv}
        <p class="text-lg text-gray-500">Loading CSV data...</p>
    {:else if valueBets.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {#each valueBets as bet}
                <Card>
                    <h3 class="text-lg font-semibold text-gray-700">{bet.home_team} vs {bet.away_team}</h3>
                    <p class="mt-2 text-gray-600">
                        <strong>Home Probability (Poisson):</strong> {bet.modelProbHome.toFixed(2)}
                        <br>
                        <strong>Draw Probability (Poisson):</strong> {bet.modelProbDraw.toFixed(2)}
                        <br>
                        <strong>Away Probability (Poisson):</strong> {bet.modelProbAway.toFixed(2)}
                    </p>
                    <p class="mt-2 text-gray-600">
                        <strong>Implied Home Probability:</strong> {bet.impliedProbHome.toFixed(2)}
                        <br>
                        <strong>Implied Draw Probability:</strong> {bet.impliedProbDraw.toFixed(2)}
                        <br>
                        <strong>Implied Away Probability:</strong> {bet.impliedProbAway.toFixed(2)}
                    </p>
                    <p class="mt-4 text-gray-800">
                        <strong>Profit:</strong>
                        {#if bet.isValueBetHome}
                            {((bet.modelProbHome * bet.home_odds * wager) - wager).toFixed(2)} €
                        {:else if bet.isValueBetDraw}
                            {((bet.modelProbDraw * bet.draw_odds * wager) - wager).toFixed(2)} €
                        {:else if bet.isValueBetAway}
                            {((bet.modelProbAway * bet.away_odds * wager) - wager).toFixed(2)} €
                        {:else}
                            0.00 €
                        {/if}
                    </p>
                </Card>
            {/each}
        </div>
    {:else}
        <p class="text-lg text-gray-500">No value bets found</p>
    {/if}

    <div class="mt-8">
        <h2 class="text-2xl font-bold text-gray-800">Total Profit</h2>
        <p class="text-lg text-gray-600">{profit.toFixed(2)} €</p>
    </div>
</div>
