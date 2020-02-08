import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FixturesComponent } from './fixtures/fixtures.component';
import { ResultsComponent } from './results/results.component';
import { TablesComponent } from './tables/tables.component';
import { Head2headComponent } from './head2head/head2head.component';
import { PlayersComponent } from './players/players.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import ApiService from './api.service';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    FixturesComponent,
    ResultsComponent,
    TablesComponent,
    Head2headComponent,
    PlayersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
