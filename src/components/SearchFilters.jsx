import { MapPin, Search } from 'lucide-react';

export function SearchFilters({ searchTerm, searchLocation, onSearchTermChange, onSearchLocationChange }) {
  return (
    <div className="painel-busca">
      <div className="linha-busca">
        <label className="campo-busca">
          <Search size={22} />
          <input
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Procurar por nome do evento ou palavra-chave..."
          />
        </label>

        <label className="campo-busca campo-local">
          <MapPin size={22} />
          <input
            value={searchLocation}
            onChange={(event) => onSearchLocationChange(event.target.value)}
            placeholder="Local"
          />
        </label>

        <button className="botao-pesquisar">Pesquisar</button>
      </div>
    </div>
  );
}
