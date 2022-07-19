import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './components/registration/registration.component';
import { ReplayComponent } from './components/replay/replay.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { NavbarComponent } from './components/navbar/navbar.component';
import { PaginationModule } from "ngx-bootstrap/pagination";
import {MatCardModule} from "@angular/material/card";
import {AlertModule} from "ngx-bootstrap/alert";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {NgxSelectModule} from "ngx-select-ex";
import { UpdateMetadataComponent } from './components/update-metadata/update-metadata.component';
import { PlayerModalComponent } from './components/modals/player-modal/player-modal.component';
import { ErrorModalComponent } from './components/modals/error-modal/error-modal.component';
import { TeamModalComponent } from './components/modals/team-modal/team-modal.component';
import { ModalYesNoComponent } from './components/modals/modal-yes-no/modal-yes-no.component';
import { QuarterComponent } from './components/registration/quarter/quarter.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CardTeamComponent } from './components/card-team/card-team.component';
import { MetadataFormComponent } from './components/metadata-form/metadata-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistrationComponent,
    ReplayComponent,
    NavbarComponent,
    UpdateMetadataComponent,
    PlayerModalComponent,
    ErrorModalComponent,
    TeamModalComponent,
    ModalYesNoComponent,
    QuarterComponent,
    CardTeamComponent,
    MetadataFormComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ModalModule.forRoot(),
        ProgressbarModule,
        ReactiveFormsModule,
        PaginationModule,
        MatCardModule,
        AlertModule,
        CollapseModule,
        NgxSelectModule,
        NgxSliderModule
    ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
