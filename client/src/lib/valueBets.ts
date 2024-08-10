import { dixonColesModel, poissonModel, predictOutcome, calculateTeamAverages } from "$lib/models";
import { normalizeTeamName } from "$lib/utils";

export function identifyValueBets(odds, csvData, rho = 0.1) {
  const valueBets = [];

  // normalizacija timova u csvData
  const normalizedCsvData = csvData.map(match => ({
    ...match,
    home_team: normalizeTeamName(match.home_team),
    away_team: normalizeTeamName(match.away_team),
  }));

  odds.forEach(odd => {
    const homeTeam = odd.home_team ? normalizeTeamName(odd.home_team) : 'Unknown Home Team';
    const awayTeam = odd.away_team ? normalizeTeamName(odd.away_team) : 'Unknown Away Team';

    console.log(`Normalized Odds - Home Team: ${homeTeam}, Away Team: ${awayTeam}`);

    // nadi podatke za konkretnu utakmicu u normaliziranim CSV podacima
    const matchData = normalizedCsvData.find(row => row.home_team === homeTeam && row.away_team === awayTeam);

    if (!matchData) {
      console.error(`No match data found for ${homeTeam} vs ${awayTeam}`);
      console.log('Available teams in CSV:', normalizedCsvData.map(row => `${row.home_team} vs ${row.away_team}`).join(', '));
      return;
    }

    console.log('Match Data Found:', matchData);

    // izračunaj prosjeke za odredene timove
    const {
      avgGoalsHomeFor,
      avgGoalsHomeAgainst,
      avgGoalsAwayFor,
      avgGoalsAwayAgainst
    } = calculateTeamAverages(normalizedCsvData, homeTeam, awayTeam);

    const avgGoalsHome = (avgGoalsHomeFor + avgGoalsAwayAgainst) / 2;
    const avgGoalsAway = (avgGoalsAwayFor + avgGoalsHomeAgainst) / 2;

    console.log(`Calculated Averages - Home: ${avgGoalsHome}, Away: ${avgGoalsAway}`);

    // Poissonov model
    const { homeGoals, awayGoals } = poissonModel(avgGoalsHome, avgGoalsAway);
    const { homeWin, draw, awayWin } = predictOutcome(homeGoals, awayGoals);

    // Dixon-Colesov model
    const { adjustedHomeGoals, adjustedAwayGoals } = dixonColesModel(avgGoalsHome, avgGoalsAway, rho);
    const { homeWin: dcHomeWin, draw: dcDraw, awayWin: dcAwayWin } = predictOutcome(adjustedHomeGoals, adjustedAwayGoals);

    // implicirane vjerojatnosti iz kvota
    const impliedProbHome = odd.home_odds > 0 ? 1 / odd.home_odds : 0;
    const impliedProbDraw = odd.draw_odds > 0 ? 1 / odd.draw_odds : 0;
    const impliedProbAway = odd.away_odds > 0 ? 1 / odd.away_odds : 0;

    console.log(`Match: ${homeTeam} vs ${awayTeam}`);
    console.log(`Poisson Probabilities: Home: ${homeWin}, Draw: ${draw}, Away: ${awayWin}`);
    console.log(`Dixon-Coles Probabilities: Home: ${dcHomeWin}, Draw: ${dcDraw}, Away: ${dcAwayWin}`);
    console.log(`Implied Probabilities: Home: ${impliedProbHome}, Draw: ${impliedProbDraw}, Away: ${impliedProbAway}`);

    // usporedi procjene s impliciranim vjerojatnostima
    const isValueBetHome = homeWin > impliedProbHome * 1.001 || dcHomeWin > impliedProbHome * 1.001;
    const isValueBetDraw = draw > impliedProbDraw * 1.001 || dcDraw > impliedProbDraw * 1.001;
    const isValueBetAway = awayWin > impliedProbAway * 1.001 || dcAwayWin > impliedProbAway * 1.001;

    if (isValueBetHome || isValueBetDraw || isValueBetAway) {
      valueBets.push({
        home_team: homeTeam,
        away_team: awayTeam,
        home_odds: odd.home_odds,
        draw_odds: odd.draw_odds,
        away_odds: odd.away_odds,
        impliedProbHome,
        impliedProbDraw,
        impliedProbAway,
        modelProbHome: homeWin,
        modelProbDraw: draw,
        modelProbAway: awayWin,
        dcModelProbHome: dcHomeWin,
        dcModelProbDraw: dcDraw,
        dcModelProbAway: dcAwayWin,
        isValueBetHome,
        isValueBetDraw,
        isValueBetAway
      });
    }
  });

  console.log('Identified Value Bets:', valueBets);
  return valueBets;
}