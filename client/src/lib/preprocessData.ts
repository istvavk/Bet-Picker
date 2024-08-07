import {normalizeTeamName} from "$lib/utils";

export function preprocessData(data: any[]) {
  return data.map((row) => {
    if (!row.home || !row.visitor) {
      console.error('Home or away team is undefined:', row);
      return null;
    }

    const goalsHome = parseInt(row.hgoal, 10);
    const goalsAway = parseInt(row.vgoal, 10);

    if (isNaN(goalsHome) || isNaN(goalsAway)) {
      console.error('Invalid goals data:', row);
      return null;
    }

    return {
      date: new Date(row.Date),
      season: row.Season,
      home_team: normalizeTeamName(row.home),
      away_team: normalizeTeamName(row.visitor),
      goals_home: goalsHome,
      goals_away: goalsAway,
      tier: row.tier,
      division: row.division
    };
  }).filter(row => row !== null);
}

/*export function preprocessData(data: any[]): any[] {
  return data.map((row: any) => ({
    date: new Date(row.Date),
    season: row.Season,
    home_team: normalizeTeamName(row.home),
    away_team: normalizeTeamName(row.visitor),
    goals_home: row.hgoal,
    goals_away: row.vgoal,
    tier: row.tier,
    division: row.division
  }));
}*/
