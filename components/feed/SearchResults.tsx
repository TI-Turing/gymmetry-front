import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'exercise';
  title: string;
  content: string;
  author: { id: string; name: string };
  stats: { likes: number; comments: number };
  createdAt: string;
}

interface SearchResultsProps {
  query: string;
  filters?: Record<string, unknown>;
  onResultPress?: (result: SearchResult) => void;
  maxHeight?: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  filters: _filters = {},
  onResultPress,
  maxHeight = 400,
}) => {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  const performSearch = React.useCallback(async () => {
    try {
      setLoading(true);

      // Simular delay de búsqueda
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Resultados simulados
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'post',
          title: `Rutina para ${query}`,
          content: `Ejercicios relacionados con ${query}`,
          author: { id: 'user1', name: 'FitnessExpert' },
          stats: { likes: 24, comments: 8 },
          createdAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          type: 'user',
          title: 'CoachProfesional',
          content: `Especialista en ${query}`,
          author: { id: 'user2', name: 'CoachProfesional' },
          stats: { likes: 156, comments: 0 },
          createdAt: '2024-01-14T15:45:00Z',
        },
      ];

      setResults(mockResults);
    } catch (error) {
      // Error en búsqueda
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  React.useEffect(() => {
    if (query.trim().length > 0) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query, performSearch]);

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => onResultPress?.(item)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.author}>Por {item.author.name}</Text>
      <Text style={styles.stats}>
        ❤️ {item.stats.likes} 💬 {item.stats.comments}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Buscando...</Text>
      </View>
    );
  }

  if (query.trim().length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Escribe algo para buscar</Text>
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          No se encontraron resultados para "{query}"
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { maxHeight }]}>
      <Text style={styles.resultCount}>
        {results.length} resultado{results.length !== 1 ? 's' : ''} para "
        {query}"
      </Text>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  resultItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  stats: {
    fontSize: 12,
    color: '#999',
  },
  loadingText: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center' as const,
    color: '#999',
    fontSize: 14,
  },
  resultCount: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500' as const,
  },
};

export default SearchResults;
export type { SearchResult, SearchResultsProps };
