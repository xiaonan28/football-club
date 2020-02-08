import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export default class ApiService {
  API_KEY = '429415caee92497c9d59abff7fef78dc';

  // BASE_URL = 'http://api.football-data.org/v2';
  BASE_URL = '/api';


  MAIN_CLUB_ID = 61;

  MATCH_STATUS_SCHEDULED = 'SCHEDULED';
  MATCH_STATUS_FINISHED = 'FINISHED';

  WINNER_HOME_TEAM = 'HOME_TEAM';
  WINNER_DRAW = 'DRAW';
  WINNER_AWAY_TEAM = 'AWAY_TEAM';

  crestUrlMapping = {

  };

  constructor(private httpClient: HttpClient) { }

  getMatchUrl(teamId) {
    return `${this.BASE_URL}/teams/${teamId}/matches`;
  }

  getTeamsUrl(teamId) {
    return `${this.BASE_URL}/teams/${teamId}`;
  }

  getCompetitionsTeamsUrl(competitionId) {
    return `${this.BASE_URL}/competitions/${competitionId}/teams`;
  }

  getCompetitionUrl(competitionId) {
    return `${this.BASE_URL}/competitions/${competitionId}`;
  }

  getTableUrl(competitionId) {
    return `${this.BASE_URL}/competitions/${competitionId}/standings`;
  }

  getMatches(teamId, status, limit) {
    let url = this.getMatchUrl(teamId);

    let params = {

    }

    if (status) {
      params["status"] = status;
    }

    if (limit) {
      params["limit"] = limit;
    }

    return this.commonGet(url, params);
  }

  getTeam(teamId) {
    let url = this.getTeamsUrl(teamId);

    return this.commonGet(url, {});
  }

  async getCompetitions(teamId) {
    let team = await this.getTeam(teamId);

    return team["activeCompetitions"];
  }

  async getPlayers(teamId) {
    let team = await this.getTeam(teamId);

    return team["squad"];
  }

  /**
   *  @returns {
   *    currentSeason:{
   *      id
   *      name
   *    }
   *  }
   */
  async getCompetition(competitionId) {
    let url = this.getCompetitionUrl(competitionId);

    return this.commonGet(url, {});
  }

  /**
   *
   * @return {
   *  standings: [
   *    the first element [0]
   *    {
   *      table:[
   *        for each team:
   *        {
   *          position:
   *          team:{}
   *          playedGames
   *          won
   *          draw
   *          lost
   *          points
   *        }
   *      ]
   *    }
   *  ]
   * }
   */
  async getTotalTable(competitionId) {
    let url = this.getTableUrl(competitionId);

    return this.commonGet(url, {
      standingType: "TOTAL"
    });
  }

  /**
   * get rival h2h for current season competitions.
   */
  async getCompetitionAndRivalTeams() {
    let results = await this.getResults();

    let competitions = {};

    //get available competitions
    for (let match of results) {
      let competition = competitions[match.competition.id];

      if (!competition) {
        competition = {
          id: match.competition.id,
          name: match.competition.name,
          //id: { id, name, crestUrl, home:{ won, draw, lost, diff }, rival:{} }
          rivals: {}
        }

        competitions[match.competition.id] = competition;
      }

      let rivals = competitions[match.competition.id].rivals

      //get rival team info
      let isMainTeamHome = match.homeTeam.id == this.MAIN_CLUB_ID;
      let rivalTeam = !isMainTeamHome ? match.homeTeam : match.awayTeam;

      let rival = rivals[rivalTeam.id];

      if (!rival) {
        rivalTeam.home = {
          won: 0,
          draw: 0,
          lost: 0,
          diff: 0,
        };
        rivalTeam.rival = {
          won: 0,
          draw: 0,
          lost: 0,
          diff: 0,
        };

        rivals[rivalTeam.id] = rivalTeam;
        rival = rivalTeam;
      }

      let matchResult = match.score.winner;

      switch (matchResult) {
        case this.WINNER_DRAW:
          rival.home.draw += 1;
          rival.rival.draw += 1;
          break;

        case this.WINNER_HOME_TEAM:
          if (isMainTeamHome) {
            rival.home.won += 1;
            rival.home.diff = rival.home.won - rival.home.lost;
            rival.rival.lost += 1;
            rival.rival.diff = rival.rival.won - rival.rival.lost;
          } else {
            rival.rival.won += 1;
            rival.rival.diff = rival.rival.won - rival.rival.lost;
            rival.home.lost += 1;
            rival.home.diff = rival.home.won - rival.home.lost;
          }

          break;

        case this.WINNER_AWAY_TEAM:
          if (!isMainTeamHome) {
            rival.home.won += 1;
            rival.home.diff = rival.home.won - rival.home.lost;
            rival.rival.lost += 1;
            rival.rival.diff = rival.rival.won - rival.rival.lost;
          } else {
            rival.rival.won += 1;
            rival.rival.diff = rival.rival.won - rival.rival.lost;
            rival.home.lost += 1;
            rival.home.diff = rival.home.won - rival.home.lost;
          }

          break;

        default:
          break;
      }
    }

    return competitions;
  }

  getTeamCrestUrl = async function (teamObj, crestUrlMapping) {
    let crestUrl = crestUrlMapping ? crestUrlMapping[teamObj.id] : null;

    if (!crestUrl) {
      let teamResult = await this.getTeam(teamObj.id);

      crestUrl = teamResult.crestUrl;
    }

    teamObj.crestUrl = crestUrl;
  }

  getCrestUrlMapping = async function (competitionId) {
    let url = this.getCompetitionsTeamsUrl(competitionId);

    let teamsResult = await this.commonGet(url, {});

    let teams = teamsResult.teams;

    let mapping = {};

    for (let team of teams) {
      mapping[team.id] = team.crestUrl;
    }

    return mapping;
  }

  getMatchTeamCrestUrl = async function (matchObj) {
    let competitionId = matchObj.competition.id;

    let crestUrlMapping = this.crestUrlMapping[competitionId];

    if (!crestUrlMapping) {
      crestUrlMapping = await this.getCrestUrlMapping(competitionId);

      this.crestUrlMapping[competitionId] = crestUrlMapping;
    }

    //home
    await this.getTeamCrestUrl(matchObj.homeTeam, crestUrlMapping);

    //away
    await this.getTeamCrestUrl(matchObj.awayTeam, crestUrlMapping);
  }

  /**
   * @returns {
   *  theNearestScheduledMatch:{
   *    competition: {
   *      name: competition name like "FA Cup"
   *    },
   *    utcDate: match date and time, need to transfer to Australia local time.  Australia/Sydney
   *    homeTeam: {
   *      name
   *      crestUrl
   *    }
   *    awayTeam: {
   *      name
   *      crestUrl
   *    }
   *  },
   *  theNearestFinishedMatch:{
   *    competition: {
   *      name: competition name like "FA Cup"
   *    },
   *    utcDate: match date and time, need to transfer to Australia local time.  Australia/Sydney
   *    homeTeam: {
   *      name
   *      crestUrl
   *    }
   *    awayTeam: {
   *      name
   *      crestUrl
   *    }
   *    score: {
   *      fullTime: {
   *        "homeTeam": 2,
   *        "awayTeam": 3
   *      }
   *    }
   * }
   * }
   */
  getHomePageInfo = async function () {
    let scheduledMatchesResult = await this.getMatches(this.MAIN_CLUB_ID, this.MATCH_STATUS_SCHEDULED, 1);
    let theNearestScheduledMatch = scheduledMatchesResult.matches[0];

    await this.getMatchTeamCrestUrl(theNearestScheduledMatch);

    let finishedMatchesResult = await this.getMatches(this.MAIN_CLUB_ID, this.MATCH_STATUS_FINISHED);

    let finishedMatches = finishedMatchesResult.matches;

    let theNearestFinishedMatch = finishedMatches[finishedMatches.length - 1];

    await this.getMatchTeamCrestUrl(theNearestFinishedMatch);

    return {
      theNearestScheduledMatch,
      theNearestFinishedMatch
    }
  }

  getFixtures = async function () {
    let scheduledMatchesResult = await this.getMatches(this.MAIN_CLUB_ID, this.MATCH_STATUS_SCHEDULED, 10);

    for (let match of scheduledMatchesResult.matches) {
      await this.getMatchTeamCrestUrl(match);
    }

    return scheduledMatchesResult.matches;
  }

  getResults = async function () {
    let scheduledMatchesResult = await this.getMatches(this.MAIN_CLUB_ID, this.MATCH_STATUS_FINISHED);

    for (let match of scheduledMatchesResult.matches) {
      await this.getMatchTeamCrestUrl(match);
    }

    return scheduledMatchesResult.matches.reverse();
  }

  commonGet(url, params) {
    return this.httpGet(url, params, {
      "X-Auth-Token": this.API_KEY
    }).toPromise().catch((reason) => {

      return {};
    });
  }

  httpGet(url, params, headers) {
    return this.httpClient.get(url, {
      params,
      headers,
    });
  }

}