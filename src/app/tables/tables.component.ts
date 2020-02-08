import { Component, OnInit } from '@angular/core';
import ApiService from '../api.service';
import momentTimezone from 'moment-timezone'


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  tables;
  public api: ApiService = null
  competitions;
  competitionId = 2021;
  teamId;
  league;
  season;

  constructor(
    api: ApiService
  ) {
    this.api = api
  }

  async ngOnInit() {

    this.teamId = this.api.MAIN_CLUB_ID
    this.loadData(this.competitionId)

  }

  selectChange(id, name) {
    this.league = name;
    this.loadData(id)
  }

  async loadData(id) {
    this.tables = null;
    this.season = null;
    let result = await this.api.getTotalTable(id);
    this.tables = result['standings'][0].table
    this.season = momentTimezone(result['season'].startDate).format('YYYY') + '-' + momentTimezone(result['season'].endDate).format('YY');
  }

}
