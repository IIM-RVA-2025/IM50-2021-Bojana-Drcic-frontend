import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html'
})
export class FilmComponent implements OnInit {

  filmovi: any[] = [];

  naziv = '';
  recenzija: number | null = null;
  trajanje: number | null = null;
  zanr = '';

  private filmUrl = 'http://localhost:3000/filmovi';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFilmovi();
  }

  loadFilmovi() {
    this.http.get<any[]>(this.filmUrl)
      .subscribe(data => this.filmovi = data);
  }

  // HTML verovatno ima (click)="add()"
  add() {
    if (!this.naziv) {
      return;
    }

    const film = {
      naziv: this.naziv,
      recenzija: this.recenzija,
      trajanje: this.trajanje,
      zanr: this.zanr
    };

    this.http.post(this.filmUrl, film)
      .subscribe(() => {
        this.naziv = '';
        this.recenzija = null;
        this.trajanje = null;
        this.zanr = '';
        this.loadFilmovi();
      });
  }

  // HTML verovatno ima (click)="delete(f.id)"
  delete(id: number) {
    this.http.delete(`${this.filmUrl}/${id}`)
      .subscribe(() => this.loadFilmovi());
  }
}
