import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html'
})
export class SalaComponent implements OnInit {

  sale: any[] = [];
  bioskopi: any[] = [];

  kapacitet: number | null = null;
  brojRedova: number | null = null;
  bioskopId: number | null = null;

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

  // HTML ima (click)="add()"
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

  // HTML ima (click)="delete(s.id)"
  delete(id: number) {
    this.http.delete(`${this.salaUrl}/${id}`)
      .subscribe(() => this.loadSale());
  }
}
