import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchTerm: string = '';
  items: any[] = []; // Aquí debes tener la lista completa de elementos

  updateSearchTerm(event: any) {
    this.searchTerm = event.target.value;
  }

  get filteredItems(): any[] {
    if (!this.items || !this.searchTerm) {
      return this.items;
    }
    const searchTerm = this.searchTerm.toLowerCase();
    return this.items.filter(item => {
      const nombreCompleto = `${item.nombre} ${item.apellido}`.toLowerCase();
      return nombreCompleto.includes(searchTerm);
    });
  }
}
