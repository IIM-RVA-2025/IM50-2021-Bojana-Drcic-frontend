import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bioskop',
  templateUrl: './bioskop.component.html',
  styleUrls: ['./bioskop.component.css']
})
export class BioskopComponent implements OnInit {

  bioskopi: any[] = [];

  naziv = '';
  adresa = '';

  editMode: boolean = false;
  editingId: number | null = null;

  searchText: string = '';  // ← ADD THIS

  private apiUrl = 'http://localhost:3000/bioskopi';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBioskopi();
  }

  loadBioskopi() {
    this.http.get<any[]>(this.apiUrl)
      .subscribe(data => this.bioskopi = data);
  }

  // ← ADD THIS METHOD
  getFilteredBioskopi(): any[] {  // ← Add return type
  console.log('Filtering with:', this.searchText);  // ← Debug log
  console.log('All bioskopi:', this.bioskopi);      // ← Debug log
  
  if (!this.searchText || this.searchText.trim() === '') {
    return this.bioskopi;
  }
  
  const filtered = this.bioskopi.filter(b => 
    b.naziv?.toLowerCase().includes(this.searchText.toLowerCase()) ||
    b.adresa?.toLowerCase().includes(this.searchText.toLowerCase())
  );
  
  console.log('Filtered result:', filtered);  // ← Debug log
  return filtered;
}

onSearchChange() {
  console.log('Search changed to:', this.searchText);
}

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

  cancelEdit() {
    this.editMode = false;
    this.editingId = null;
    this.naziv = '';
    this.adresa = '';
  }

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