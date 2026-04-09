export const getStatusTone = (value: string): 'neutral' | 'info' | 'success' | 'warning' | 'danger' => {
  const normalized = value.toLowerCase();

  if (normalized.includes('active') || normalized.includes('approved') || normalized.includes('finished')) {
    return 'success';
  }

  if (normalized.includes('progress') || normalized.includes('registration') || normalized.includes('scoring')) {
    return 'info';
  }

  if (normalized.includes('pending') || normalized.includes('draft') || normalized.includes('open')) {
    return 'warning';
  }

  if (normalized.includes('banned') || normalized.includes('reject') || normalized.includes('appeal')) {
    return 'danger';
  }

  return 'neutral';
};
