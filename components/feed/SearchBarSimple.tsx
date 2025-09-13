import React, { useState, useMemo } from 'react';
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

const SearchBarSimple: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = 'Buscar en el feed...',
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockSuggestions = useMemo(
    () => [
      'rutina de piernas',
      'ejercicios cardiovasculares',
      'dieta proteica',
      'gimnasio cerca',
      'entrenamiento funcional',
      'yoga para principiantes',
    ],
    []
  );

  const suggestions = useMemo(() => {
    if (query.length < 2) return [];
    return mockSuggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }, [query, mockSuggestions]);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    setShowSuggestions(text.length > 2);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim(), filters);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion, filters);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    onClear?.();
  };

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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
            <Text style={styles.filterLabel}>Tipo:</Text>
            <View style={styles.filterOptions}>
              {[
                { key: 'all', label: 'Todo' },
                { key: 'posts', label: 'Posts' },
                { key: 'users', label: 'Usuarios' },
                { key: 'hashtags', label: 'Tags' },
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
          </View>

          {/* Ordenar por */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Ordenar:</Text>
            <View style={styles.filterOptions}>
              {[
                { key: 'relevance', label: 'Relevancia' },
                { key: 'date', label: 'Fecha' },
                { key: 'popularity', label: 'Popular' },
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
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterChipText: {
    color: '#fff',
  },
});

export default SearchBarSimple;
export type { SearchBarProps, SearchFilters };
