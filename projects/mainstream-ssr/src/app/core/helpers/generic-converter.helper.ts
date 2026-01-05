export type Unit = 'B' | 'KB' | 'MB' | 'GB';

const unitMap: Record<Unit, number> = {
  'B': 1,
  'KB': 1024,
  'MB': 1024 ** 2, // (**) -> elevado a 2
  'GB': 1024 ** 3,
};

/**
 * Converte um valor de uma unidade para outra.
 * Ex: convert(105, 'KB', 'B')  → 107520
 */
export function convert(value: number, from: Unit, to: Unit): string {
  const fromFactor = unitMap[from];
  const toFactor = unitMap[to];

  if (!fromFactor || !toFactor) {
    throw new Error(`Unidade inválida: ${from} ou ${to}`);
  }

  // Converte primeiro para a unidade base
  const baseValue = value * fromFactor;

  // Depois converte da base para a unidade desejada
  return `${ baseValue / toFactor } ${ to }`;
}