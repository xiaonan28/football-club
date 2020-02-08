import { Component, OnInit } from '@angular/core';
import ApiService from '../api.service'
import momentTimezone from 'moment-timezone'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  public api: ApiService = null;
  objKeys = Object.keys
  list = {};

  constructor(
    api: ApiService
  ) {
    this.api = api
  }

  async ngOnInit() {

    const result = await this.api.getResults();

    for (let i in result) {
      let arr = this.list[result[i].utcDate] || [];
      result[i]['dateDDMY'] = this.dateFormat(result[i].utcDate).dateDDMY
      result[i]['dateDWY'] = this.dateFormat(result[i].utcDate).dateDWY
      result[i]['week'] = this.dateFormat(result[i].utcDate).week
      arr.push(result[i])
      this.list[result[i].utcDate] = arr;
    }

  }

  dateFormat(date) {

    let result = momentTimezone(date).tz('Australia/Sydney');

    return {
      week: result.format('dddd'),
      dateDWY: result.format('ddd Wo YYYY'),
      dateDDMY: result.format('dddd D MMMM YYYY')
    }
  }

}
