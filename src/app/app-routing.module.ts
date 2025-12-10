import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './main/home/home.component';
import { BioskopComponent } from './bioskop/bioskop.component';
import { SalaComponent } from './sala/sala.component';
import { FilmComponent } from './film/film.component';
import { RezervacijaComponent } from './rezervacija/rezervacija.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bioskopi', component: BioskopComponent },
  { path: 'sale', component: SalaComponent },
  { path: 'filmovi', component: FilmComponent },
  { path: 'rezervacije', component: RezervacijaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
