import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReplayComponent } from './components/replay/replay.component';
import {RegistrationComponent} from "./components/registration/registration.component";
import {UpdateMetadataComponent} from "./components/update-metadata/update-metadata.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'replay/:id',
    component: ReplayComponent,
  },
  {
    path: 'modify/:id',
    component: UpdateMetadataComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routerConfig: Routes = [];
