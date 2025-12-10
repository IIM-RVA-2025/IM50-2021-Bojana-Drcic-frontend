import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bioskop',
  templateUrl: './bioskop.component.html'
})
export class BioskopComponent implements OnInit {

  bioskopi: any[] = [];

  naziv = '';
  adresa = '';

  private apiUrl = 'http://localhost:3000/bioskopi';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBioskopi();
  }

  loadBioskopi() {
    this.http.get<any[]>(this.apiUrl)
      .subscribe(data => this.bioskopi = data);
  }

  // HTML zove (click)="add()"
  add() {
    if (this.editMode) { return; }
    if (!this.naziv || !this.adresa) {
      return;
    }

    const bioskop = {
      naziv: this.naziv,
      adresa: this.adresa
    };

    this.http.post(this.apiUrl, bioskop)
      .subscribe(() => {
        this.naziv = '';
        this.adresa = '';
        this.loadBioskopi();
      });
  }

// u klasi BioskopComponent

editMode: boolean = false;
editingId: number | null = null;

startEdit(b: any) {
  this.editMode = true;
  this.editingId = b.id;
  this.naziv = b.naziv;
  this.adresa = b.adresa;
}

update() {
  if (!this.editingId || !this.naziv || !this.adresa) {
    return;
  }

  const bioskop = {
    naziv: this.naziv,
    adresa: this.adresa
  };

  this.http.put(`${this.apiUrl}/${this.editingId}`, bioskop)
    .subscribe(() => {
      this.naziv = '';
      this.adresa = '';
      this.editMode = false;
      this.editingId = null;
      this.loadBioskopi();
    });
}

  // HTML zove (click)="delete(b.id)"
  delete(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe(() => this.loadBioskopi());
  }

  confirmDelete(id: number) {
  const ok = confirm('Da li ste sigurni da želite da obrišete ovaj bioskop?');
  if (ok) {
    this.delete(id);
  }
}
}


