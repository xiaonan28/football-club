import { Component, OnInit } from '@angular/core';
import ApiService from '../api.service';

@Component({
  selector: 'app-head2head',
  templateUrl: './head2head.component.html',
  styleUrls: ['./head2head.component.scss']
})
export class Head2headComponent implements OnInit {
  public api: ApiService = null
  competition;
  competitionId = 2021;
  competitionName = 'Premier League'
  league;
  rival;
  rivals_obj;
  rivals;
  table;

  constructor(
    api: ApiService
  ) {
    this.api = api
  }

  async ngOnInit() {
    this.competition = await this.api.getCompetitionAndRivalTeams()
    this.initData()
  }

  initData() {
    this.selectLeague(this.competitionId, this.competitionName)
    this.selectRivals(this.rivals[0].id,this.rivals[0].name)
  }

  selectLeague(id, name) {
    this.league = name
    this.rivals = [];
    this.rivals_obj = {}

    this.rivals_obj = this.competition[id].rivals

    for (let i in this.rivals_obj) {
      this.rivals.push(this.rivals_obj[i])
    }

    this.selectRivals(this.rivals[0].id,this.rivals[0].name)

  }

  selectRivals(id, name) {
    this.rival = name
    this.table = this.rivals_obj[id]
  }

}
