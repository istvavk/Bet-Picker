import { create, all } from 'mathjs';

const math = create(all);

function poissonProbability(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / math.factorial(k);
}

export function poissonModel(avgGoalsHome: number, avgGoalsAway: number, maxGoals: number = 10) {
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

      //console.log(`homeGoals[${i}]: ${homeGoals[i]}, awayGoals[${j}]: ${awayGoals[j]}, prob: ${prob}`);
    }
  }
  console.log(`Predicted Outcome - Home Win: ${homeWin}, Draw: ${draw}, Away Win: ${awayWin}`);
  return { homeWin, draw, awayWin };
}

