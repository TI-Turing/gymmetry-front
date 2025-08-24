import Colors from '@/constants/Colors';

// Visual theming for payment lifecycle statuses
export type PaymentVisual = {
  borderColor: string;
  backgroundColor: string;
  color: string;
};

export function getPaymentVisual(status: string | null): PaymentVisual {
  const light = Colors.light;
  switch (status) {
    case 'approved':
      return {
        borderColor: light.tint,
        backgroundColor: light.background,
        color: light.tint,
      };
    case 'rejected':
    case 'error':
      return {
        borderColor: light.danger,
        backgroundColor: light.background,
        color: light.danger,
      };
    case 'cancelled':
      return {
        borderColor: light.tabIconDefault,
        backgroundColor: light.background,
        color: light.text,
      };
    case 'expired':
      return {
        borderColor: light.tint,
        backgroundColor: light.background,
        color: light.tint,
      };
    case 'polling':
    case 'pending':
      return {
        borderColor: light.tabIconDefault,
        backgroundColor: light.background,
        color: light.text,
      };
    default:
      return {
        borderColor: light.tint,
        backgroundColor: light.background,
        color: light.tint,
      };
  }
}
