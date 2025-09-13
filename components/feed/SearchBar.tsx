import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClear?: () => void;
  placeholder?: string;
  initialQuery?: string;
}

interface SearchFilters {
  type: 'all' | 'posts' | 'users' | 'hashtags';
  sortBy: 'relevance' | 'date' | 'popularity';
  timeRange: 'all' | 'today' | 'week' | 'month';
}

const DEFAULT_FILTERS: SearchFilters = {
  type: 'all',
  sortBy: 'relevance',
  timeRange: 'all',
};

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = 'Buscar en el feed...',
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sugerencias simuladas
  const mockSuggestions = useMemo(
    () => [
      'rutina de piernas',
      'ejercicios cardiovasculares',
      'dieta proteica',
      'gimnasio cerca',
      'entrenamiento funcional',
      'yoga para principiantes',
      'suplementos deportivos',
      'recuperación muscular',
    ],
    []
  );

  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);

      // Simular sugerencias basadas en la consulta
      if (text.length > 2) {
        const filtered = mockSuggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(text.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [mockSuggestions]
  );

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim(), filters);
      setShowSuggestions(false);
      // Agregar a historial (implementar más tarde)
    }
  }, [query, filters, onSearch]);

  const handleSuggestionPress = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      setShowSuggestions(false);
      onSearch(suggestion, filters);
    },
    [filters, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onClear?.();
  }, [onClear]);

  const updateFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda principal */}
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={query}
            onChangeText={handleQueryChange}
            placeholder={placeholder}
            placeholderTextColor="#666"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {query.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsScroll}
          >
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Panel de filtros */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          {/* Tipo de contenido */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Tipo de contenido:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {[
                  { key: 'all', label: 'Todo' },
                  { key: 'posts', label: 'Posts' },
                  { key: 'users', label: 'Usuarios' },
                  { key: 'hashtags', label: 'Hashtags' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterChip,
                      filters.type === option.key && styles.activeFilterChip,
                    ]}
                    onPress={() =>
                      updateFilter('type', option.key as SearchFilters['type'])
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.type === option.key &&
                          styles.activeFilterChipText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Ordenar por */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Ordenar por:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {[
                  { key: 'relevance', label: 'Relevancia' },
                  { key: 'date', label: 'Fecha' },
                  { key: 'popularity', label: 'Popularidad' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterChip,
                      filters.sortBy === option.key && styles.activeFilterChip,
                    ]}
                    onPress={() =>
                      updateFilter(
                        'sortBy',
                        option.key as SearchFilters['sortBy']
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.sortBy === option.key &&
                          styles.activeFilterChipText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Rango de tiempo */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Rango de tiempo:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {[
                  { key: 'all', label: 'Todo el tiempo' },
                  { key: 'today', label: 'Hoy' },
                  { key: 'week', label: 'Esta semana' },
                  { key: 'month', label: 'Este mes' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterChip,
                      filters.timeRange === option.key &&
                        styles.activeFilterChip,
                    ]}
                    onPress={() =>
                      updateFilter(
                        'timeRange',
                        option.key as SearchFilters['timeRange']
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.timeRange === option.key &&
                          styles.activeFilterChipText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 16,
  },
  suggestionsContainer: {
    marginTop: 12,
  },
  suggestionsScroll: {
    maxHeight: 40,
  },
  suggestionChip: {
    backgroundColor: '#e8f4fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#0066cc',
  },
  filtersPanel: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterChipText: {
    color: '#fff',
  },
});

export default SearchBar;
export type { SearchBarProps, SearchFilters };
