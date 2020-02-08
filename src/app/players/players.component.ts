import { Component, OnInit } from '@angular/core';
import ApiService from '../api.service';

interface Players {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  PlayersOfBirth: string;
  nationality: string;
  shirtNumber: number;
  role: string;
}




@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  public api: ApiService = null;
  players;

  constructor(api: ApiService) {
    this.api = api
  }

  async ngOnInit() {
    const PLAYERS: Players[] = await this.api.getPlayers(this.api.MAIN_CLUB_ID)
    this.players = PLAYERS;

  }

}
