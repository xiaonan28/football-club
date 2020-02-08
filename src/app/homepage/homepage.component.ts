import { Component, OnInit } from '@angular/core';
import ApiService from '../api.service'
import momentTimezone from 'moment-timezone'

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public api: ApiService = null;
  theNearestScheduledMatch;
  week;
  date;
  theNearestFinishedMatch;

  constructor(
    api: ApiService
  ) {
    this.api = api;
  }

  async ngOnInit() {

    const { theNearestScheduledMatch, theNearestFinishedMatch } = await this.api.getHomePageInfo();
    this.theNearestScheduledMatch = theNearestScheduledMatch;
    this.theNearestFinishedMatch = theNearestFinishedMatch;

    // timezone && format
    const time = momentTimezone(this.theNearestScheduledMatch.utcDate).tz('Australia/Sydney');
    this.week = time.format('dddd');
    this.date = time.format('ddd Wo YYYY');

  }

}
