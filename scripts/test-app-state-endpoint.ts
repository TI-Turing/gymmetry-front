/**
 * Script de diagnóstico para probar el endpoint /app-state/overview
 *
 * Ejecutar con: npx ts-node scripts/test-app-state-endpoint.ts
 */

import axios from 'axios';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.0.16:7160/api';

async function testAppStateEndpoint() {
  console.log('\n🔍 Testing App State Endpoint');
  console.log('================================');
  console.log('Base URL:', API_BASE_URL);
  console.log('Full endpoint:', `${API_BASE_URL}/app-state/overview`);
  console.log('\n');

  try {
    console.log('⏳ Haciendo petición GET...\n');

    const response = await axios.get(`${API_BASE_URL}/app-state/overview`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Respuesta exitosa!');
    console.log('Status:', response.status);
    console.log('Headers:', JSON.stringify(response.headers, null, 2));
    console.log('\nData:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('❌ Error en la petición:\n');

    if (error.response) {
      // El servidor respondió con un status fuera del rango 2xx
      console.error('Status Code:', error.response.status);
      console.error(
        'Response Data:',
        JSON.stringify(error.response.data, null, 2)
      );
      console.error(
        'Response Headers:',
        JSON.stringify(error.response.headers, null, 2)
      );
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('No se recibió respuesta del servidor');
      console.error('Error:', error.message);
      console.error('\n🔍 Posibles causas:');
      console.error('  - El backend no está corriendo en', API_BASE_URL);
      console.error('  - El endpoint /app-state/overview no existe');
      console.error('  - Problema de red o firewall');
      console.error('  - El puerto 7160 no es accesible');
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error al configurar la petición:', error.message);
    }
  }

  console.log('\n================================\n');
}

// Test alternativo sin autenticación para verificar conectividad básica
async function testBasicConnectivity() {
  console.log('🔍 Testing Basic Connectivity');
  console.log('================================');

  try {
    // Intentar un endpoint más básico o health check
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    console.log('✅ Backend is reachable!');
    console.log('Status:', response.status);
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend NO está corriendo en', API_BASE_URL);
      console.error('\n💡 Soluciones:');
      console.error('  1. Inicia el backend: cd backend && dotnet run');
      console.error('  2. Verifica la IP en .env.local');
      console.error('  3. Asegúrate que el puerto 7160 esté libre');
    } else if (error.response?.status === 404) {
      console.log('✅ Backend está corriendo (404 es OK para /health)');
    } else {
      console.error('❌ Error de conectividad:', error.message);
    }
  }

  console.log('================================\n');
}

// Ejecutar tests
(async () => {
  await testBasicConnectivity();
  await testAppStateEndpoint();
})();
