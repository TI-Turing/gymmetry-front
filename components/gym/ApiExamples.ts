// Ejemplo de uso de las respuestas estandarizadas de la API

import { GymService } from './GymService';
import {
  GymRegistrationResponse,
  GymTypesResponse,
  CountriesResponse,
  BackendApiResponse,
} from './types';

export class GymApiExamples {
  // Ejemplo de registro de gimnasio
  static async exampleRegisterGym() {
    try {
      const response: GymRegistrationResponse = await GymService.registerGym({
        name: 'Mi Gimnasio',
        email: 'contacto@migym.com',
        phone: '+57 300 123 4567',
        nit: '900123456-1',
      });

      // Estructura estandarizada del backend C#
      if (response.Success) {
        console.log('Gimnasio registrado exitosamente');
        console.log('ID del gimnasio:', response.Data?.Id);
      } else {
        console.error('Error en el registro:', response.Message);
        console.error('Código de estado:', response.StatusCode);
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
    }
  }

  // Ejemplo de obtener tipos de gimnasio
  static async exampleGetGymTypes() {
    try {
      const response: GymTypesResponse = await GymService.getGymTypes();

      if (response.Success && response.Data) {
        console.log('Tipos de gimnasio disponibles:');
        response.Data.forEach(type => {
          console.log(`- ${type.Name}: ${type.Description}`);
        });
      } else {
        console.error('No se pudieron obtener los tipos:', response.Message);
      }
    } catch (error) {
      console.error('Error obteniendo tipos:', error);
    }
  }

  // Ejemplo de obtener países
  static async exampleGetCountries() {
    try {
      const response: CountriesResponse = await GymService.getCountries();

      if (response.Success && response.Data) {
        console.log('Países disponibles:');
        response.Data.forEach(country => {
          console.log(`- ${country.Name} (${country.Code})`);
        });
      } else {
        console.error('No se pudieron obtener los países:', response.Message);
      }
    } catch (error) {
      console.error('Error obteniendo países:', error);
    }
  }

  // Ejemplo de actualizar gimnasio
  static async exampleUpdateGym(gymId: string) {
    try {
      const response = await GymService.updateGym(gymId, {
        gymTypeId: 'type-123',
        slogan: 'Tu mejor versión te espera',
        description: 'Un gimnasio moderno con equipos de última generación',
      });

      if (response.Success) {
        console.log('Gimnasio actualizado exitosamente');
        console.log('Respuesta:', response.Data);
      } else {
        console.error('Error en la actualización:', response.Message);
      }
    } catch (error) {
      console.error('Error actualizando gimnasio:', error);
    }
  }

  // Helper para verificar estructura de respuesta
  static validateApiResponse<T>(response: BackendApiResponse<T>): boolean {
    return (
      typeof response.Success === 'boolean' &&
      typeof response.Message === 'string' &&
      typeof response.StatusCode === 'number' &&
      response.Data !== undefined
    );
  }
}

/*
ESTRUCTURA ESTANDARIZADA DE RESPUESTAS:

Todas las respuestas de la API siguen esta estructura que coincide 
exactamente con el backend de C# (ApiResponse<T>):

{
  "Success": boolean,      // Indica si la operación fue exitosa
  "Message": string,       // Mensaje descriptivo (éxito o error)
  "Data": T | null,       // Los datos específicos del endpoint
  "StatusCode": number     // Código de estado HTTP
}

VENTAJAS:
1. Consistencia total con el backend
2. Tipado fuerte en TypeScript
3. Manejo uniforme de errores
4. Fácil validación de respuestas
5. Mejor experiencia de desarrollo
*/
