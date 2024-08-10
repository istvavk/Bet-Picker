import { create, all } from 'mathjs';

const math = create(all);

function poissonProbability(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / math.factorial(k);
}

export function poissonModel(avgGoalsHome: number, avgGoalsAway: number, maxGoals: number = 10) {
  console.log('Input Data for Poisson Model:', avgGoalsHome, avgGoalsAway);
  const homeGoals = Array.from({ length: maxGoals }, (_, k) => poissonProbability(avgGoalsHome, k));
  const awayGoals = Array.from({ length: maxGoals }, (_, k) => poissonProbability(avgGoalsAway, k));
  console.log('Poisson Model - Home Goals:', homeGoals);
  console.log('Poisson Model - Away Goals:', awayGoals);
  return { homeGoals, awayGoals };
}

export function dixonColesModel(avgGoalsHome: number, avgGoalsAway: number, rho: number, maxGoals: number = 10) {
  const homeGoals = Array.from({ length: maxGoals }, (_, k) => poissonProbability(avgGoalsHome, k));
  const awayGoals = Array.from({ length: maxGoals }, (_, k) => poissonProbability(avgGoalsAway, k));
  const adjustedHomeGoals = homeGoals.map((hg, i) => hg * Math.exp(-rho * (i / avgGoalsHome)));
  const adjustedAwayGoals = awayGoals.map((ag, i) => ag * Math.exp(-rho * (i / avgGoalsAway)));
  console.log('Dixon-Coles Model - Adjusted Home Goals:', adjustedHomeGoals);
  console.log('Dixon-Coles Model - Adjusted Away Goals:', adjustedAwayGoals);
  return { adjustedHomeGoals, adjustedAwayGoals };
}

// predikcija ishoda utakmice
export function predictOutcome(homeGoals: number[], awayGoals: number[]): { homeWin: number, draw: number, awayWin: number } {
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  for (let i = 0; i < homeGoals.length; i++) {
    for (let j = 0; j < awayGoals.length; j++) {
      const prob = homeGoals[i] * awayGoals[j];
      if (i > j) homeWin += prob;
      else if (i === j) draw += prob;
      else awayWin += prob;
    }
  }
  console.log(`Predicted Outcome - Home Win: ${homeWin}, Draw: ${draw}, Away Win: ${awayWin}`);
  return { homeWin, draw, awayWin };
}

export function calculateTeamAverages(csvData, homeTeam: string, awayTeam: string) {
  let homeGoalsFor = 0, homeGoalsAgainst = 0, homeGames = 0;
  let awayGoalsFor = 0, awayGoalsAgainst = 0, awayGames = 0;

  csvData.forEach(match => {
    if (match.home_team === homeTeam) {
      homeGoalsFor += match.goals_home;
      homeGoalsAgainst += match.goals_away;
      homeGames++;
    }
    if (match.away_team === awayTeam) {
      awayGoalsFor += match.goals_away;
      awayGoalsAgainst += match.goals_home;
      awayGames++;
    }
  });

  const avgGoalsHomeFor = homeGames > 0 ? homeGoalsFor / homeGames : 0;
  const avgGoalsHomeAgainst = homeGames > 0 ? homeGoalsAgainst / homeGames : 0;
  const avgGoalsAwayFor = awayGames > 0 ? awayGoalsFor / awayGames : 0;
  const avgGoalsAwayAgainst = awayGames > 0 ? awayGoalsAgainst / awayGames : 0;

  return {
    avgGoalsHomeFor,
    avgGoalsHomeAgainst,
    avgGoalsAwayFor,
    avgGoalsAwayAgainst
  };
}

