import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'football-club-mainpage';
  links = [
    { title: 'HOMEPAGE', path: 'homepage' },
    { title: 'FIXTURES', path: 'fixtures' },
    { title: 'RESULTS', path: 'results' },
    { title: 'TABLES', path: 'tables' },
    { title: 'HEAD 2 HEAD', path: 'head2head' },
    { title: 'PLAYERS', path: 'players' }
  ];
  current = '';

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.fragment.subscribe(i => this.current = i);
  }
}
