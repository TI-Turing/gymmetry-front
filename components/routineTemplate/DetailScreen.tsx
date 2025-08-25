import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  View as RNView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import type { RoutineTemplate } from '@/models/RoutineTemplate';
import { routineTemplateService } from '@/services';
import { gymService } from '@/services/gymService';
import { userService } from '@/services/userService';
import Skeleton from '@/components/common/Skeleton';
import Button from '@/components/common/Button';
import { normalizeCollection } from '@/utils';

export default function RoutineTemplateDetailScreen() {
  const params = useLocalSearchParams<{ templateId?: string }>();
  const templateId = params?.templateId ? String(params.templateId) : null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<RoutineTemplate | null>(null);
  const [gymName, setGymName] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<RoutineTemplate[]>([]);
  const [debounceId, setDebounceId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const loadTemplate = useCallback(async () => {
    if (!templateId) {
      setError('Plantilla no encontrada');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Traer detalle directo por ID
      const res = await routineTemplateService.getRoutineTemplate(templateId);
      const found =
        res?.Success && res.Data ? (res.Data as RoutineTemplate) : null;
      setTemplate(found);

      // Gym name
      const gymId = (found as unknown as { GymId?: string | null })?.GymId;
      if (gymId) {
        try {
          const g = await gymService.getGymById(gymId);
          if (g?.Success && g.Data) setGymName(g.Data.Name || 'Gimnasio');
          else setGymName(null);
        } catch {
          setGymName(null);
        }
      } else {
        setGymName(null);
      }
      // Author name si aplica
      const authorId = (found as unknown as { Author_UserId?: string | null })
        ?.Author_UserId;
      if (authorId) {
        try {
          const u = await userService.getUserById(authorId);
          if (u?.Success && u.Data) {
            setAuthorName(
              u.Data.UserName || u.Data.Name || `Usuario ${authorId}`
            );
          } else {
            setAuthorName(null);
          }
        } catch {
          setAuthorName(null);
        }
      } else {
        setAuthorName(null);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : null;
      setError(msg || 'Error al cargar el detalle');
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  // Búsqueda en tiempo real (contains) por nombre de plantilla
  useEffect(() => {
    if (debounceId) clearTimeout(debounceId);
    if (!search || search.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await routineTemplateService.findRoutineTemplatesByFields({
          Name: search.trim(),
        } as unknown as { Name: string });
        const arr = res?.Success
          ? (normalizeCollection<RoutineTemplate>(
              res.Data
            ) as RoutineTemplate[])
          : [];
        setSearchResults(arr);
      } catch {
        // silencioso
      }
    }, 350);
    setDebounceId(t);
    return () => clearTimeout(t);
  }, [search, debounceId]);

  const objectives = useMemo(() => {
    const raw = (template as unknown as { TagsObjectives?: string | null })
      ?.TagsObjectives as string | null | undefined;
    if (!raw)
      return [] as {
        key: string;
        label: string;
        pct: number;
        score: number;
      }[];
    let parsed: Record<string, number> | null = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    if (!parsed) return [];
    const entries = Object.entries(parsed).filter(([_, v]) => Number(v) > 0);
    entries.sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0));
    const fmt = (k: string) =>
      k
        .replace(/_/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    return entries.map(([key, val]) => {
      const clamped = Math.max(0, Math.min(1, Number(val) || 0));
      return {
        key,
        label: fmt(key),
        pct: clamped * 100,
        score: Math.round(clamped * 10),
      };
    });
  }, [template]);

  const handleGoBack = () => router.back();

  return (
    <ScreenWrapper
      headerTitle={template?.Name || 'Detalle de rutina'}
      showBackButton
      onPressBack={handleGoBack}
      backgroundColor="#1A1A1A"
    >
      {loading ? (
        <ScrollView
          style={{ paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* Búsqueda por nombre */}
          <RNView style={{ marginTop: 12, marginBottom: 8 }}>
            <Text style={{ color: '#B0B0B0', marginBottom: 6 }}>
              Buscar plantilla
            </Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Nombre de la plantilla"
              placeholderTextColor="#888"
              style={{
                backgroundColor: '#1E1E1E',
                color: '#FFF',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: '#333',
              }}
            />
          </RNView>

          {searchResults.length > 0 && (
            <RNView style={{ marginBottom: 12 }}>
              <Text style={{ color: '#AAA', marginBottom: 8 }}>
                Resultados ({searchResults.length})
              </Text>
              {searchResults.map((rt) => (
                <TouchableOpacity
                  key={rt.Id}
                  onPress={() => {
                    router.replace({
                      pathname: '/routine-template-detail',
                      params: { templateId: String(rt.Id) },
                    });
                    setSearch('');
                    setSearchResults([]);
                  }}
                  style={{ paddingVertical: 8 }}
                >
                  <Text style={{ color: '#FF6B35' }}>{rt.Name}</Text>
                </TouchableOpacity>
              ))}
            </RNView>
          )}
          <RNView style={{ marginTop: 12 }}>
            {/* Título */}
            <Skeleton width="70%" height={22} borderRadius={6} />
            {/* Comentarios */}
            <Skeleton width="90%" height={14} style={{ marginTop: 12 }} />
            <Skeleton width="80%" height={14} style={{ marginTop: 8 }} />
            {/* Autor / Gimnasio */}
            <Skeleton width="45%" height={14} style={{ marginTop: 14 }} />
            <Skeleton width="50%" height={14} style={{ marginTop: 8 }} />
            {/* Objetivos header */}
            <Skeleton width="35%" height={16} style={{ marginTop: 18 }} />
            {/* Objetivos barras */}
            <RNView style={{ marginTop: 10, gap: 10 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <RNView
                  key={i}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Skeleton width={160} height={14} />
                  <RNView style={{ flex: 1 }}>
                    <Skeleton width="100%" height={14} />
                  </RNView>
                  <Skeleton width={28} height={14} />
                </RNView>
              ))}
            </RNView>
          </RNView>
        </ScrollView>
      ) : error ? (
        <RNView style={{ padding: 16 }}>
          <Text style={{ color: '#FF6B35' }}>{error}</Text>
        </RNView>
      ) : !template ? (
        <RNView style={{ padding: 16 }}>
          <Text style={{ color: '#B0B0B0' }}>No se encontró la rutina.</Text>
        </RNView>
      ) : (
        <ScrollView
          style={{ paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* Nombre y comentarios */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#FFFFFF',
              marginTop: 12,
            }}
          >
            {template.Name}
          </Text>
          {!!template.Comments && (
            <Text style={{ color: '#B0B0B0', marginTop: 6 }}>
              {template.Comments}
            </Text>
          )}

          {/* Autor */}
          {(template as unknown as { Author_UserId?: string | null })
            ?.Author_UserId ? (
            <TouchableOpacity
              onPress={() => {
                // TODO: navegar al perfil del usuario con id (template as any).Author_UserId
                // router.push({ pathname: '/user-profile', params: { userId: String((template as any).Author_UserId) } });
              }}
              style={{ marginTop: 12 }}
            >
              <Text style={{ color: '#FF6B35', fontWeight: '600' }}>
                Autor: {authorName ?? 'Ver perfil del autor'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{ color: '#B0B0B0', marginTop: 12, fontStyle: 'italic' }}
            >
              Plantilla prediseñada por Gymmetry
            </Text>
          )}

          {/* Gym si aplica */}
          {!!(template as unknown as { GymId?: string | null })?.GymId && (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/gym',
                  params: {
                    gymId: (template as unknown as { GymId?: string | null })
                      .GymId,
                  },
                })
              }
              style={{ marginTop: 8 }}
            >
              <Text style={{ color: '#FF6B35', fontWeight: '600' }}>
                Gimnasio: {gymName ?? 'Ver información'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Objetivos */}
          {objectives.length > 0 && (
            <RNView style={{ marginTop: 16 }}>
              <RNView
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                  Objetivos
                </Text>
                <Text style={{ color: '#AAAAAA', fontSize: 12 }}>
                  (Calculado por IA)
                </Text>
              </RNView>
              <RNView
                style={{
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <RNView style={{ gap: 10 }}>
                  {objectives.map((item) => (
                    <RNView
                      key={item.key}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Text
                        style={{ color: '#CCCCCC', width: 160 }}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                      <RNView style={{ flex: 1 }}>
                        <RNView
                          style={{
                            height: 14,
                            backgroundColor: '#2A2A2A',
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          <RNView
                            style={{
                              width: `${item.pct}%`,
                              height: '100%',
                              backgroundColor: '#FF6B35',
                            }}
                          />
                        </RNView>
                      </RNView>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          width: 28,
                          textAlign: 'right',
                        }}
                      >
                        {item.score}
                      </Text>
                    </RNView>
                  ))}
                </RNView>
              </RNView>
            </RNView>
          )}

          {/* CTA: Ver días de la rutina */}
          {templateId && (
            <RNView style={{ marginTop: 20 }}>
              <Button
                title="Ver días de la rutina"
                onPress={() =>
                  router.push({
                    pathname: '/routine-template-days',
                    params: { templateId },
                  })
                }
              />
            </RNView>
          )}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}
