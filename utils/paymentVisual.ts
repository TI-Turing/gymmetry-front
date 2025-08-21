import Colors from '@/constants/Colors';

// Visual theming for payment lifecycle statuses
export type PaymentVisual = { borderColor: string; backgroundColor: string; color: string };

export function getPaymentVisual(status: string | null): PaymentVisual {
  switch (status) {
    case 'approved':
      return { borderColor: '#1f8f4d', backgroundColor: '#0d2a1b', color: '#31d27a' };
    case 'rejected':
      return { borderColor: '#b00020', backgroundColor: '#2a0d12', color: '#ff4d5d' };
    case 'cancelled':
      return { borderColor: '#b59f00', backgroundColor: '#2a2500', color: '#e6c300' };
    case 'expired':
      return { borderColor: Colors.light.tint, backgroundColor: '#2d1604', color: Colors.light.tint };
    case 'error':
      return { borderColor: '#b00020', backgroundColor: '#2a0d12', color: '#ff4d5d' };
    case 'polling':
    case 'pending':
      return { borderColor: '#0078d4', backgroundColor: '#0c2233', color: '#3aaaff' };
    default:
      return { borderColor: Colors.light.tint, backgroundColor: '#1a1a1a', color: Colors.light.tint };
  }
}
