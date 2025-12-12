import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css']
})
export class SalaComponent implements OnInit {

  sale: any[] = [];
  bioskopi: any[] = [];

  kapacitet: number | null = null;
  brojRedova: number | null = null;
  bioskopId: number | null = null;

  editMode: boolean = false;
  editingId: number | null = null;

  searchText: string = '';  // ← ADD THIS

  private salaUrl = 'http://localhost:3000/sale';
  private bioskopUrl = 'http://localhost:3000/bioskopi';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSale();
    this.loadBioskopi();
  }

  loadSale() {
    this.http.get<any[]>(this.salaUrl)
      .subscribe(data => this.sale = data);
  }

  loadBioskopi() {
    this.http.get<any[]>(this.bioskopUrl)
      .subscribe(data => this.bioskopi = data);
  }

  // ← ADD THIS METHOD
  getFilteredSale(): any[] {
    if (!this.searchText || this.searchText.trim() === '') {
      return this.sale;
    }
    return this.sale.filter(s => {
      const bioskopName = this.getBioskopName(s.bioskopId);
      return bioskopName.toLowerCase().includes(this.searchText.toLowerCase()) ||
             s.kapacitet?.toString().includes(this.searchText) ||
             s.brojRedova?.toString().includes(this.searchText);
    });
  }

  // ← ADD THIS METHOD
  onSearchChange() {
    // This triggers change detection
  }

  add() {
    if (!this.kapacitet || !this.brojRedova || !this.bioskopId) {
      return;
    }

    const sala = {
      kapacitet: this.kapacitet,
      brojRedova: this.brojRedova,
      bioskopId: this.bioskopId
    };

    this.http.post(this.salaUrl, sala)
      .subscribe(() => {
        this.kapacitet = null;
        this.brojRedova = null;
        this.bioskopId = null;
        this.loadSale();
      });
  }

  startEdit(s: any) {
    this.editMode = true;
    this.editingId = s.id;
    this.kapacitet = s.kapacitet;
    this.brojRedova = s.brojRedova;
    this.bioskopId = s.bioskopId;
  }

  update() {
    if (!this.editingId || !this.kapacitet || !this.brojRedova || !this.bioskopId) {
      return;
    }

    const sala = {
      kapacitet: this.kapacitet,
      brojRedova: this.brojRedova,
      bioskopId: this.bioskopId
    };

    this.http.put(`${this.salaUrl}/${this.editingId}`, sala)
      .subscribe(() => {
        this.kapacitet = null;
        this.brojRedova = null;
        this.bioskopId = null;
        this.editMode = false;
        this.editingId = null;
        this.loadSale();
      });
  }

  cancelEdit() {
    this.editMode = false;
    this.editingId = null;
    this.kapacitet = null;
    this.brojRedova = null;
    this.bioskopId = null;
  }

  delete(id: number) {
    this.http.delete(`${this.salaUrl}/${id}`)
      .subscribe(() => this.loadSale());
  }

  confirmDelete(id: number) {
    const ok = confirm('Da li ste sigurni da želite da obrišete ovu salu?');
    if (ok) {
      this.delete(id);
    }
  }

  getBioskopName(bioskopId: number): string {
    const bioskop = this.bioskopi.find(b => b.id === bioskopId);
    return bioskop ? bioskop.naziv : 'N/A';
  }

  getTotalCapacity(): number {
    return this.sale.reduce((acc, s) => acc + (s.kapacitet || 0), 0);
  }

  getAverageRows(): string {
    if (this.sale.length === 0) return '0';
    const sum = this.sale.reduce((acc, s) => acc + (s.brojRedova || 0), 0);
    return (sum / this.sale.length).toFixed(1);
  }
}