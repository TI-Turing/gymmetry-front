// Guía de uso de los nuevos servicios
// Estos servicios reemplazan las llamadas directas a apiService para funciones específicas

import {
  userService,
  gymServiceExtensions,
  accessMethodTypeService,
  branchService,
  branchMediaService,
} from './index';

// ====================================
// EJEMPLOS DE USO - USER SERVICE
// ====================================

export const userExamples = {
  // Crear nuevo usuario
  async createUser() {
    try {
      const response = await userService.addUser({
        email: 'usuario@ejemplo.com',
        password: 'password123',
      });

      if (response.Success) {
        console.log('Usuario creado:', response.Data.id);
        return response.Data;
      }
      console.error('Error:', response.Message);
    } catch (error) {
      console.error('Error en createUser:', error);
    }
  },

  // Obtener usuario por ID
  async getUser(userId: string) {
    try {
      const response = await userService.getUserById(userId);

      if (response.Success) {
        console.log('Usuario encontrado:', response.Data);
        return response.Data;
      }
      console.error('Error:', response.Message);
    } catch (error) {
      console.error('Error en getUser:', error);
    }
  },

  // Actualizar usuario
  async updateUser(userId: string) {
    try {
      const response = await userService.updateUser({
        id: userId,
        name: 'Juan',
        lastName: 'Pérez',
        userName: 'jperez',
        phone: '+57123456789',
      });

      if (response.Success) {
        console.log('Usuario actualizado exitosamente');
        return true;
      }
      console.error('Error:', response.Message);
    } catch (error) {
      console.error('Error en updateUser:', error);
    }
  },

  // Solicitar OTP
  async requestOtp(userId: string) {
    try {
      const response = await userService.requestOtp({
        userId,
        verificationType: 'phone',
        recipient: '+57123456789',
        method: 'sms',
      });

      if (response.Success) {
        console.log('OTP enviado exitosamente');
        return true;
      }
      console.error('Error:', response.Message);
    } catch (error) {
      console.error('Error en requestOtp:', error);
    }
  },

  // Validar OTP
  async validateOtp(userId: string, otpCode: string) {
    try {
      const response = await userService.validateOtp({
        userId,
        otp: otpCode,
        verificationType: 'phone',
        recipient: '+57123456789',
      });

      if (response.Success) {
        console.log('OTP validado exitosamente');
        return true;
      }
      console.error('Error:', response.Message);
    } catch (error) {
      console.error('Error en validateOtp:', error);
    }
  },
};

// ====================================
// EJEMPLOS DE USO - GYM SERVICE EXTENSIONS
// ====================================

export const gymExamples = {
  // Generar código QR del gimnasio
  async generateQr(gymId: string) {
    try {
      const response = await gymServiceExtensions.generateGymQr({
        gymId,
        url: 'https://example.com/gym/' + gymId,
      });

      if (response.Success) {
        console.log('QR generado:', response.Data.qrCode);
        return response.Data.qrCode;
      }
      console.error('Error:', response.Message);
    } catch (error) {
      console.error('Error en generateQr:', error);
    }
  },

  // Subir logo del gimnasio
  async uploadLogo(gymId: string, imageBuffer: ArrayBuffer) {
    try {
      const response = await gymServiceExtensions.uploadGymLogo({
        gymId,
        image: imageBuffer,
        fileName: 'logo.png',
        contentType: 'image/png',
      });

      if (response.Success) {
        console.log('Logo subido exitosamente');
        return response.Data; // URL del logo
      }
      console.error('Error:', response.Message);
    } catch (error) {
      console.error('Error en uploadLogo:', error);
    }
  },

  // Eliminar gimnasio
  async deleteGym(gymId: string) {
    try {
      const response = await gymServiceExtensions.deleteGym(gymId);

      if (response.Success) {
        console.log('Gimnasio eliminado exitosamente');
        return true;
      }
      console.error('Error:', response.Message);
    } catch (error) {
      console.error('Error en deleteGym:', error);
    }
  },
};

// ====================================
// EJEMPLOS DE USO - ACCESS METHOD TYPE SERVICE
// ====================================

export const accessMethodTypeExamples = {
  // Crear nuevo método de acceso
  async createAccessMethodType(name: string) {
    try {
      const response = await accessMethodTypeService.addAccessMethodType({
        name,
      });

      if (response.Success) {
        // console.log('Método de acceso creado:', response.Data);
        return response.Data;
      }
      // console.error('Error:', response.Message);
    } catch (error) {
      // console.error('Error en createAccessMethodType:', error);
    }
  },

  // Obtener todos los métodos de acceso
  async getAllAccessMethodTypes() {
    try {
      const response = await accessMethodTypeService.getAllAccessMethodTypes();

      if (response.Success) {
        // console.log('Métodos de acceso:', response.Data);
        return response.Data;
      }
      // console.error('Error:', response.Message);
    } catch (error) {
      // console.error('Error en getAllAccessMethodTypes:', error);
    }
  },
};

// ====================================
// EJEMPLOS DE USO - BRANCH SERVICE
// ====================================

export const branchExamples = {
  // Crear nueva sede
  async createBranch(gymId: string) {
    try {
      const response = await branchService.addBranch({
        name: 'Sede Principal',
        address: 'Calle 123 #45-67',
        cityId: '00000000-0000-0000-0000-000000000000',
        regionId: '00000000-0000-0000-0000-000000000000',
        gymId,
        accessMethodId: 'EC6CF2C1-72D2-4B78-932B-E1248928E483',
      });

      if (response.Success) {
        // console.log('Sede creada:', response.Data);
        return response.Data;
      }
      // console.error('Error:', response.Message);
    } catch (error) {
      // console.error('Error en createBranch:', error);
    }
  },

  // Obtener sedes de un gimnasio
  async getBranchesByGym(gymId: string) {
    try {
      const response = await branchService.getBranchesByGymId(gymId);

      if (response.Success) {
        // console.log('Sedes encontradas:', response.Data);
        return response.Data;
      }
      // console.error('Error:', response.Message);
    } catch (error) {
      // console.error('Error en getBranchesByGym:', error);
    }
  },
};

// ====================================
// EJEMPLOS DE USO - BRANCH MEDIA SERVICE
// ====================================

export const branchMediaExamples = {
  // Subir imagen de sede
  async uploadBranchImage(branchId: string, imageBuffer: ArrayBuffer) {
    try {
      const response = await branchMediaService.uploadBranchImage({
        branchId,
        image: imageBuffer,
        fileName: 'sede-imagen.jpg',
        contentType: 'image/jpeg',
        imageType: 'main',
      });

      if (response.Success) {
        // console.log('Imagen subida:', response.Data);
        return response.Data;
      }
      // console.error('Error:', response.Message);
    } catch (error) {
      // console.error('Error en uploadBranchImage:', error);
    }
  },

  // Obtener imágenes de una sede
  async getBranchImages(branchId: string) {
    try {
      const response = await branchMediaService.getBranchImages(branchId);

      if (response.Success) {
        // console.log('Imágenes de la sede:', response.Data);
        return response.Data;
      }
      // console.error('Error:', response.Message);
    } catch (error) {
      // console.error('Error en getBranchImages:', error);
    }
  },
};

// ====================================
// FORMATO DE RESPUESTA ESTÁNDAR
// ====================================

/*
Todas las funciones retornan este formato estándar de las Azure Functions:

interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}

Ejemplo de uso:
const response = await userService.addUser(userData);
if (response.Success) {
  // Usar response.Data
} else {
  // Manejar error con response.Message
}
*/
