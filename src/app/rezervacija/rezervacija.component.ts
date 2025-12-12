import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rezervacija',
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.css']
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

  editMode: boolean = false;
  editingId: number | null = null;

  searchText: string = '';  // ← ADD THIS

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

  // ← ADD THIS METHOD
  getFilteredRezervacije(): any[] {
    if (!this.searchText || this.searchText.trim() === '') {
      return this.rezervacije;
    }
    return this.rezervacije.filter(r => {
      const filmName = this.getFilmName(r.filmId);
      return filmName.toLowerCase().includes(this.searchText.toLowerCase()) ||
             r.datum?.includes(this.searchText) ||
             r.brojOsoba?.toString().includes(this.searchText);
    });
  }

  // ← ADD THIS METHOD
  onSearchChange() {
    // This triggers change detection
  }

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

  startEdit(r: any) {
    this.editMode = true;
    this.editingId = r.id;
    this.brojOsoba = r.brojOsoba;
    this.cenaKarte = r.cenaKarte;
    this.datum = r.datum;
    this.placeno = r.placeno;
    this.filmId = r.filmId;
    this.salaId = r.salaId;
  }

  update() {
    if (!this.editingId || !this.brojOsoba || !this.cenaKarte || !this.datum || !this.filmId || !this.salaId) {
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

    this.http.put(`${this.rezervacijaUrl}/${this.editingId}`, rezervacija)
      .subscribe(() => {
        this.brojOsoba = null;
        this.cenaKarte = null;
        this.datum = '';
        this.placeno = false;
        this.filmId = null;
        this.salaId = null;
        this.editMode = false;
        this.editingId = null;
        this.loadRezervacije();
      });
  }

  cancelEdit() {
    this.editMode = false;
    this.editingId = null;
    this.brojOsoba = null;
    this.cenaKarte = null;
    this.datum = '';
    this.placeno = false;
    this.filmId = null;
    this.salaId = null;
  }

  delete(id: number) {
    this.http.delete(`${this.rezervacijaUrl}/${id}`)
      .subscribe(() => this.loadRezervacije());
  }

  confirmDelete(id: number) {
    const ok = confirm('Da li ste sigurni da želite da obrišete ovu rezervaciju?');
    if (ok) {
      this.delete(id);
    }
  }

  getFilmName(filmId: number): string {
    const film = this.filmovi.find(f => f.id === filmId);
    return film ? film.naziv : 'N/A';
  }

  getTotalRevenue(): number {
    return this.rezervacije.reduce((acc, r) => acc + (r.cenaKarte * r.brojOsoba || 0), 0);
  }

  getTotalPeople(): number {
    return this.rezervacije.reduce((acc, r) => acc + (r.brojOsoba || 0), 0);
  }
}