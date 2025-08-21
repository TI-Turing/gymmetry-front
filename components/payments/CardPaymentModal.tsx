import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';

type Props = {
  visible: boolean;
  onClose: () => void;
  onToken: (token: string) => void;
  publicKey?: string | null;
  buyerEmail?: string | null;
  amount?: number | null;
};

export default function CardPaymentModal({ visible, onClose, onToken, publicKey, buyerEmail, amount }: Props) {
  const WebView: any = useMemo(() => {
    try { return require('react-native-webview').WebView; } catch { return null; }
  }, []);
  const [ready, setReady] = useState(false);
  const [webviewKey, setWebviewKey] = useState(0);
  const [sdkMsg, setSdkMsg] = useState<string | null>(null);
  useEffect(() => {
    let t: any;
    if (visible) {
      t = setTimeout(() => setReady(true), 0);
    } else {
      setReady(false);
      setSdkMsg(null);
    }
    return () => { if (t) clearTimeout(t); setReady(false); };
  }, [visible]);

  const html = useMemo(() => {
    const key = publicKey || '';
    const email = buyerEmail || '';
    const amt = Math.max(1, Number(amount || 0));
    return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://sdk.mercadopago.com/js/v2"></script>
  <style>body{background:#121212;color:#fff;font-family:system-ui;margin:0;padding:16px} .btn{margin-top:12px;padding:12px 16px;border-radius:8px;background:#2a2a2a;color:#fff;border:1px solid #444;cursor:pointer} .btn[disabled]{opacity:.6;cursor:not-allowed} #status{margin-top:8px;color:#ccc;font-size:12px;min-height:16px}</style>
  </head>
  <body>
    <h3>Pago con Tarjeta</h3>
    <div id=\"cardForm\"></div>
  <button id=\"payBtn\" class=\"btn\" disabled>Cargando formulario...</button>
  <div id=\"status\"></div>
  <button id=\"retryBtn\" class=\"btn\" style=\"display:none\">Reintentar carga</button>
    <script>
      let card;
      let submitting = false;
  const initBricks = async () => {
        try {
          const mp = new MercadoPago('${key}', { locale: 'es-CO' });
          const bricksBuilder = mp.bricks();
          card = await bricksBuilder.create('cardForm', 'cardForm', {
            initialization: { amount: ${amt}, payer: { email: '${email}' } },
            callbacks: {
              onReady: () => { 
                const st = document.getElementById('status');
                if (st) st.innerText = 'Formulario listo';
                const b = document.getElementById('payBtn');
                if (b) { b.removeAttribute('disabled'); b.innerText = 'Pagar con tarjeta'; }
        const rb = document.getElementById('retryBtn');
        if (rb) rb.style.display = 'none';
              },
              onError: (e) => { 
                const st = document.getElementById('status');
                if (st) st.innerText = 'Error cargando formulario';
        const rb = document.getElementById('retryBtn');
        if (rb) rb.style.display = 'inline-block';
                window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'ERROR', error: String(e && (e.message||e)) })); 
              },
              onSubmit: ({ selectedPaymentMethod, formData }) => {
                const token = formData?.token;
                if (token) {
                  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'CARD_TOKEN', token }));
                } else {
                  window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'ERROR', error: 'No se generó token de tarjeta' }));
                }
              }
            }
          });
        } catch (e) {
          const st = document.getElementById('status');
          if (st) st.innerText = 'Error inicializando Bricks';
      const rb = document.getElementById('retryBtn');
      if (rb) rb.style.display = 'inline-block';
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'ERROR', error: String(e && (e.message||e)) }));
        }
      };

      // Esperar a que el SDK esté disponible
      const ensureSdk = () => typeof window.MercadoPago !== 'undefined';
      if (ensureSdk()) {
        initBricks();
      } else {
        const st = document.getElementById('status');
        if (st) st.innerText = 'Cargando SDK de pagos...';
        const check = setInterval(() => {
          if (ensureSdk()) { clearInterval(check); initBricks(); }
        }, 300);
    setTimeout(() => { 
          if (!card) { 
            clearInterval(check);
            const st2 = document.getElementById('status'); 
            if (st2) st2.innerText = 'No se pudo cargar el SDK. Revisa tu conexión.'; 
            const rb = document.getElementById('retryBtn');
            if (rb) rb.style.display = 'inline-block';
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'SDK_TIMEOUT' }));
          } 
        }, 10000);
      }

      // Reintentar manualmente
      const retryBtn = document.getElementById('retryBtn');
  retryBtn.addEventListener('click', () => {
        const st = document.getElementById('status');
        if (st) st.innerText = 'Reintentando...';
        const rb = document.getElementById('retryBtn');
        if (rb) rb.style.display = 'none';
        initBricks();
      });
      const btn = document.getElementById('payBtn');
      const statusEl = document.getElementById('status');
      btn.addEventListener('click', async () => {
        if (submitting) return;
        if (!card) { if (statusEl) statusEl.innerText = 'Aún inicializando, intenta en unos segundos.'; return; }
        submitting = true;
        btn.disabled = true;
        const prev = btn.innerText;
        btn.innerText = 'Procesando...';
        if (statusEl) statusEl.innerText = 'Validando datos de tarjeta...';
        try { await card.submit(); }
        catch (e) { 
          if (statusEl) statusEl.innerText = 'No se pudo procesar, revisa los datos.';
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'ERROR', error: String(e && (e.message||e)) })); 
        }
        finally { submitting = false; btn.disabled = false; btn.innerText = prev; }
      });
    </script>
  </body>
</html>`;
  }, [publicKey, buyerEmail, amount]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Tarjeta de crédito/débito</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.close}>Cerrar</Text></TouchableOpacity>
          </View>
          {!WebView ? (
            <View style={{ padding: 12 }}>
              <Text>No se encontró WebView. Instala react-native-webview para continuar o usa el checkout externo.</Text>
            </View>
          ) : !publicKey ? (
            <View style={{ padding: 12 }}>
              <Text>Falta la clave pública de Mercado Pago. Configura EXPO_PUBLIC_MP_PUBLIC_KEY.</Text>
            </View>
  ) : (
    <>
    <WebView
              originWhitelist={["*"]}
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="always"
              userAgent="Mozilla/5.0 (Linux; Android 12; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
              key={webviewKey}
              source={ready ? { html, baseUrl: 'https://app.gymmetry.local/' } : undefined as any}
              onMessage={(e: any) => {
                try {
                  const data = JSON.parse(e?.nativeEvent?.data || '{}');
                  if (data?.type === 'CARD_TOKEN' && data?.token) onToken(String(data.token));
                  if (data?.type === 'SDK_TIMEOUT') setSdkMsg('No se pudo cargar el SDK. Reintenta o cambia de red.');
                  if (data?.type === 'ERROR' && data?.error) setSdkMsg(String(data.error));
                } catch {}
              }}
              style={{ flex: 1, backgroundColor: '#121212' }}
            />
            {sdkMsg && (
              <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: '#333' }}>
                <Text style={{ color: '#fff', marginBottom: 8 }}>{sdkMsg}</Text>
                <TouchableOpacity onPress={() => { setSdkMsg(null); setWebviewKey(k => k + 1); }}>
                  <Text style={{ color: '#ff6b35', fontWeight: '600' }}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}
    </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { height: '80%', backgroundColor: '#1a1a1a', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  close: { color: '#ff6b35', fontWeight: '600' },
});
