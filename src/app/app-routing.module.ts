import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component'
import { FixturesComponent } from './fixtures/fixtures.component';
import { ResultsComponent } from './results/results.component';
import { TablesComponent } from './tables/tables.component';
import { Head2headComponent } from './head2head/head2head.component';
import { PlayersComponent } from './players/players.component';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'fixtures', component: FixturesComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'head2head', component: Head2headComponent },
  { path: 'players', component: PlayersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
