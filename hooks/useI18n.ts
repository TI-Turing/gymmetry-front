// Hook temporal simple para i18n - se puede expandir después
export const useI18n = () => {
  // Por ahora retorna la misma cadena, pero se puede expandir para traducciones reales
  const t = (key: string): string => {
    return key;
  };

  return { t };
};
