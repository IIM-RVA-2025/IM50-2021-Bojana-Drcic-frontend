import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html'
})
export class RezervacijaComponent implements OnInit {

  rezervacije: any[] = [];
  filmovi: any[] = [];
  sale: any[] = [];

  brojOsoba: number | null = null;
  cenaKarte: number | null = null;
  datum = '';
  placeno = false;
  filmId: number | null = null;
  salaId: number | null = null;

  private rezervacijaUrl = 'http://localhost:3000/rezervacije';
  private filmUrl = 'http://localhost:3000/filmovi';
  private salaUrl = 'http://localhost:3000/sale';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRezervacije();
    this.loadFilmovi();
    this.loadSale();
  }

  loadRezervacije() {
    this.http.get<any[]>(this.rezervacijaUrl)
      .subscribe(data => this.rezervacije = data);
  }

  loadFilmovi() {
    this.http.get<any[]>(this.filmUrl)
      .subscribe(data => this.filmovi = data);
  }

  loadSale() {
    this.http.get<any[]>(this.salaUrl)
      .subscribe(data => this.sale = data);
  }

  // HTML ima (click)="add()"
  add() {
    if (!this.brojOsoba || !this.cenaKarte || !this.datum || !this.filmId || !this.salaId) {
      return;
    }

    const rezervacija = {
      brojOsoba: this.brojOsoba,
      cenaKarte: this.cenaKarte,
      datum: this.datum,
      placeno: this.placeno,
      filmId: this.filmId,
      salaId: this.salaId
    };

    this.http.post(this.rezervacijaUrl, rezervacija)
      .subscribe(() => {
        this.brojOsoba = null;
        this.cenaKarte = null;
        this.datum = '';
        this.placeno = false;
        this.filmId = null;
        this.salaId = null;
        this.loadRezervacije();
      });
  }

  // HTML ima (click)="delete(r.id)"
  delete(id: number) {
    this.http.delete(`${this.rezervacijaUrl}/${id}`)
      .subscribe(() => this.loadRezervacije());
  }
}
