import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {

  filmovi: any[] = [];

  naziv = '';
  recenzija: number | null = null;
  trajanje: number | null = null;
  zanr = '';

  editMode: boolean = false;
  editingId: number | null = null;

  searchText: string = '';  // ← ADD THIS

  private filmUrl = 'http://localhost:3000/filmovi';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFilmovi();
  }

  loadFilmovi() {
    this.http.get<any[]>(this.filmUrl)
      .subscribe(data => this.filmovi = data);
  }

  // ← ADD THIS METHOD
  getFilteredFilmovi(): any[] {
    if (!this.searchText || this.searchText.trim() === '') {
      return this.filmovi;
    }
    return this.filmovi.filter(f => 
      f.naziv?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      f.zanr?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // ← ADD THIS METHOD
  onSearchChange() {
    // This triggers change detection
  }

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

  startEdit(f: any) {
    this.editMode = true;
    this.editingId = f.id;
    this.naziv = f.naziv;
    this.recenzija = f.recenzija;
    this.trajanje = f.trajanje;
    this.zanr = f.zanr;
  }

  update() {
    if (!this.editingId || !this.naziv) {
      return;
    }

    const film = {
      naziv: this.naziv,
      recenzija: this.recenzija,
      trajanje: this.trajanje,
      zanr: this.zanr
    };

    this.http.put(`${this.filmUrl}/${this.editingId}`, film)
      .subscribe(() => {
        this.naziv = '';
        this.recenzija = null;
        this.trajanje = null;
        this.zanr = '';
        this.editMode = false;
        this.editingId = null;
        this.loadFilmovi();
      });
  }

  cancelEdit() {
    this.editMode = false;
    this.editingId = null;
    this.naziv = '';
    this.recenzija = null;
    this.trajanje = null;
    this.zanr = '';
  }

  delete(id: number) {
    this.http.delete(`${this.filmUrl}/${id}`)
      .subscribe(() => this.loadFilmovi());
  }

  confirmDelete(id: number) {
    const ok = confirm('Da li ste sigurni da želite da obrišete ovaj film?');
    if (ok) {
      this.delete(id);
    }
  }

  getAverageRating(): string {
    if (this.filmovi.length === 0) return '0';
    const sum = this.filmovi.reduce((acc, f) => acc + (f.recenzija || 0), 0);
    return (sum / this.filmovi.length).toFixed(1);
  }

  getTotalDuration(): number {
    return this.filmovi.reduce((acc, f) => acc + (f.trajanje || 0), 0);
  }
}