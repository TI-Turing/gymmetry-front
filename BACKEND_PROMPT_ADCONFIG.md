# 🔧 BACKEND PROMPT - CONFIGURACIÓN DINÁMICA DE ANUNCIOS

**Fecha:** 9 de octubre de 2025  
**Fase:** 13 - Sistema de Configuración Dinámica  
**Stack Backend:** .NET 9 + Azure Functions + Entity Framework

---

## 🎯 OBJETIVO

Implementar endpoint para gestionar la configuración de visualización de anuncios en el feed, permitiendo ajustar dinámicamente:
- Frecuencia de anuncios (cada cuántos posts)
- Ratio de mezcla AdMob vs anuncios propios

---

## 📦 ENTIDADES REQUERIDAS

### 1. AdConfig (Nueva Entidad)

**Ubicación:** `Domain/Entities/AdConfig.cs`

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    [Table("AdConfig")]
    public class AdConfig
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// Cada cuántos posts se debe insertar un anuncio
        /// Valores típicos: 3-10
        /// </summary>
        [Required]
        [Range(3, 10)]
        public int PostsPerAd { get; set; } = 5;

        /// <summary>
        /// Porcentaje de anuncios que deben ser de AdMob (0-100)
        /// El resto serán anuncios propios
        /// Ejemplo: 60 = 60% AdMob, 40% propios
        /// </summary>
        [Required]
        [Range(0, 100)]
        public int AdMobPercentage { get; set; } = 60;

        /// <summary>
        /// Fecha de creación del registro
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Fecha de última actualización
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// ID del usuario que actualizó (opcional, para auditoría)
        /// </summary>
        public string? UpdatedBy { get; set; }

        /// <summary>
        /// Indica si esta es la configuración activa
        /// Solo debe haber una configuración con IsActive = true
        /// </summary>
        [Required]
        public bool IsActive { get; set; } = true;
    }
}
```

---

## 🗄️ MIGRACIÓN DE BASE DE DATOS

### Migration: AddAdConfigTable

**Comando:**
```bash
dotnet ef migrations add AddAdConfigTable --project Infrastructure --startup-project API
```

**Archivo generado:** `Infrastructure/Migrations/YYYYMMDDHHMMSS_AddAdConfigTable.cs`

```csharp
public partial class AddAdConfigTable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "AdConfig",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                PostsPerAd = table.Column<int>(type: "int", nullable: false),
                AdMobPercentage = table.Column<int>(type: "int", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                IsActive = table.Column<bool>(type: "bit", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AdConfig", x => x.Id);
            });

        // Insertar configuración inicial
        migrationBuilder.InsertData(
            table: "AdConfig",
            columns: new[] { "PostsPerAd", "AdMobPercentage", "CreatedAt", "IsActive" },
            values: new object[] { 5, 60, DateTime.UtcNow, true }
        );

        // Índice para búsqueda rápida de configuración activa
        migrationBuilder.CreateIndex(
            name: "IX_AdConfig_IsActive",
            table: "AdConfig",
            column: "IsActive",
            filter: "[IsActive] = 1");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "AdConfig");
    }
}
```

**Aplicar migración:**
```bash
dotnet ef database update --project Infrastructure --startup-project API
```

---

## 📊 DTOs

### 1. AdConfigResponseDto

**Ubicación:** `Application/DTOs/Advertisement/AdConfigResponseDto.cs`

```csharp
namespace Application.DTOs.Advertisement
{
    public class AdConfigResponseDto
    {
        /// <summary>
        /// Cada cuántos posts se debe insertar un anuncio
        /// </summary>
        public int PostsPerAd { get; set; }

        /// <summary>
        /// Porcentaje de anuncios que deben ser de AdMob (0-100)
        /// </summary>
        public int AdMobPercentage { get; set; }

        /// <summary>
        /// Fecha de última actualización
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Usuario que actualizó
        /// </summary>
        public string? UpdatedBy { get; set; }
    }
}
```

### 2. AdConfigRequestDto

**Ubicación:** `Application/DTOs/Advertisement/AdConfigRequestDto.cs`

```csharp
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.Advertisement
{
    public class AdConfigRequestDto
    {
        /// <summary>
        /// Cada cuántos posts se debe insertar un anuncio
        /// Valores válidos: 3-10
        /// </summary>
        [Required(ErrorMessage = "PostsPerAd es requerido")]
        [Range(3, 10, ErrorMessage = "PostsPerAd debe estar entre 3 y 10")]
        public int PostsPerAd { get; set; }

        /// <summary>
        /// Porcentaje de anuncios que deben ser de AdMob (0-100)
        /// </summary>
        [Required(ErrorMessage = "AdMobPercentage es requerido")]
        [Range(0, 100, ErrorMessage = "AdMobPercentage debe estar entre 0 y 100")]
        public int AdMobPercentage { get; set; }
    }
}
```

---

## 🏗️ APPLICATION LAYER

### IAdConfigService (Interfaz)

**Ubicación:** `Application/Interfaces/IAdConfigService.cs`

```csharp
using Application.DTOs.Advertisement;

namespace Application.Interfaces
{
    public interface IAdConfigService
    {
        /// <summary>
        /// Obtiene la configuración activa de anuncios
        /// </summary>
        Task<AdConfigResponseDto> GetActiveConfigAsync();

        /// <summary>
        /// Actualiza la configuración de anuncios
        /// </summary>
        /// <param name="dto">Nueva configuración</param>
        /// <param name="userId">ID del usuario que actualiza (opcional)</param>
        Task<AdConfigResponseDto> UpdateConfigAsync(AdConfigRequestDto dto, string? userId = null);
    }
}
```

### AdConfigService (Implementación)

**Ubicación:** `Application/Services/AdConfigService.cs`

```csharp
using Application.DTOs.Advertisement;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AdConfigService : IAdConfigService
    {
        private readonly IAdConfigRepository _repository;
        private readonly ILogger<AdConfigService> _logger;

        public AdConfigService(
            IAdConfigRepository repository,
            ILogger<AdConfigService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<AdConfigResponseDto> GetActiveConfigAsync()
        {
            try
            {
                var config = await _repository.GetActiveConfigAsync();

                if (config == null)
                {
                    _logger.LogWarning("No se encontró configuración activa, creando default");
                    
                    // Crear configuración por defecto
                    config = new AdConfig
                    {
                        PostsPerAd = 5,
                        AdMobPercentage = 60,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _repository.CreateAsync(config);
                }

                return new AdConfigResponseDto
                {
                    PostsPerAd = config.PostsPerAd,
                    AdMobPercentage = config.AdMobPercentage,
                    UpdatedAt = config.UpdatedAt,
                    UpdatedBy = config.UpdatedBy
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener configuración de anuncios");
                
                // Retornar configuración por defecto en caso de error
                return new AdConfigResponseDto
                {
                    PostsPerAd = 5,
                    AdMobPercentage = 60
                };
            }
        }

        public async Task<AdConfigResponseDto> UpdateConfigAsync(
            AdConfigRequestDto dto,
            string? userId = null)
        {
            try
            {
                // Validaciones de negocio
                if (dto.PostsPerAd < 3 || dto.PostsPerAd > 10)
                {
                    throw new ArgumentException("PostsPerAd debe estar entre 3 y 10");
                }

                if (dto.AdMobPercentage < 0 || dto.AdMobPercentage > 100)
                {
                    throw new ArgumentException("AdMobPercentage debe estar entre 0 y 100");
                }

                var config = await _repository.GetActiveConfigAsync();

                if (config == null)
                {
                    // Crear nueva configuración
                    config = new AdConfig
                    {
                        PostsPerAd = dto.PostsPerAd,
                        AdMobPercentage = dto.AdMobPercentage,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        UpdatedBy = userId
                    };

                    await _repository.CreateAsync(config);
                }
                else
                {
                    // Actualizar configuración existente
                    config.PostsPerAd = dto.PostsPerAd;
                    config.AdMobPercentage = dto.AdMobPercentage;
                    config.UpdatedAt = DateTime.UtcNow;
                    config.UpdatedBy = userId;

                    await _repository.UpdateAsync(config);
                }

                _logger.LogInformation(
                    "Configuración actualizada: PostsPerAd={PostsPerAd}, AdMobPercentage={AdMobPercentage}, UpdatedBy={UpdatedBy}",
                    config.PostsPerAd,
                    config.AdMobPercentage,
                    userId ?? "System"
                );

                return new AdConfigResponseDto
                {
                    PostsPerAd = config.PostsPerAd,
                    AdMobPercentage = config.AdMobPercentage,
                    UpdatedAt = config.UpdatedAt,
                    UpdatedBy = config.UpdatedBy
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar configuración de anuncios");
                throw;
            }
        }
    }
}
```

---

## 🗂️ REPOSITORY LAYER

### IAdConfigRepository (Interfaz)

**Ubicación:** `Infrastructure/Repositories/IAdConfigRepository.cs`

```csharp
using Domain.Entities;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public interface IAdConfigRepository
    {
        Task<AdConfig?> GetActiveConfigAsync();
        Task<AdConfig> CreateAsync(AdConfig config);
        Task<AdConfig> UpdateAsync(AdConfig config);
    }
}
```

### AdConfigRepository (Implementación)

**Ubicación:** `Infrastructure/Repositories/AdConfigRepository.cs`

```csharp
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class AdConfigRepository : IAdConfigRepository
    {
        private readonly ApplicationDbContext _context;

        public AdConfigRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AdConfig?> GetActiveConfigAsync()
        {
            return await _context.AdConfigs
                .Where(c => c.IsActive)
                .FirstOrDefaultAsync();
        }

        public async Task<AdConfig> CreateAsync(AdConfig config)
        {
            _context.AdConfigs.Add(config);
            await _context.SaveChangesAsync();
            return config;
        }

        public async Task<AdConfig> UpdateAsync(AdConfig config)
        {
            _context.AdConfigs.Update(config);
            await _context.SaveChangesAsync();
            return config;
        }
    }
}
```

---

## ⚡ AZURE FUNCTION (API)

### AdConfigFunction

**Ubicación:** `API/Functions/AdvertisementFunctions.cs` (agregar al archivo existente)

```csharp
/// <summary>
/// GET /api/advertisement/config
/// Obtiene la configuración activa de visualización de anuncios
/// </summary>
[Function("GetAdConfig")]
public async Task<HttpResponseData> GetAdConfig(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "advertisement/config")]
    HttpRequestData req)
{
    try
    {
        var config = await _adConfigService.GetActiveConfigAsync();

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(new
        {
            Success = true,
            Message = "Configuración obtenida",
            Data = config
        });

        return response;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al obtener configuración de anuncios");

        var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
        await errorResponse.WriteAsJsonAsync(new
        {
            Success = false,
            Message = "Error al obtener configuración",
            Data = (object?)null
        });

        return errorResponse;
    }
}

/// <summary>
/// PUT /api/advertisement/config
/// Actualiza la configuración de visualización de anuncios
/// Requiere autenticación (opcional: solo admins)
/// </summary>
[Function("UpdateAdConfig")]
public async Task<HttpResponseData> UpdateAdConfig(
    [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "advertisement/config")]
    HttpRequestData req)
{
    try
    {
        // Leer body
        var dto = await req.ReadFromJsonAsync<AdConfigRequestDto>();

        if (dto == null)
        {
            var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequest.WriteAsJsonAsync(new
            {
                Success = false,
                Message = "Body inválido",
                Data = (object?)null
            });
            return badRequest;
        }

        // Validar DTO (DataAnnotations)
        var validationContext = new ValidationContext(dto);
        var validationResults = new List<ValidationResult>();
        bool isValid = Validator.TryValidateObject(dto, validationContext, validationResults, true);

        if (!isValid)
        {
            var validationErrors = string.Join(", ", validationResults.Select(v => v.ErrorMessage));
            var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
            await badRequest.WriteAsJsonAsync(new
            {
                Success = false,
                Message = validationErrors,
                Data = (object?)null
            });
            return badRequest;
        }

        // Obtener userId desde headers (si está autenticado)
        string? userId = req.Headers.TryGetValues("X-User-Id", out var values)
            ? values.FirstOrDefault()
            : null;

        // Actualizar configuración
        var config = await _adConfigService.UpdateConfigAsync(dto, userId);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(new
        {
            Success = true,
            Message = "Configuración actualizada",
            Data = config
        });

        return response;
    }
    catch (ArgumentException ex)
    {
        _logger.LogWarning(ex, "Validación fallida al actualizar configuración");

        var badRequest = req.CreateResponse(HttpStatusCode.BadRequest);
        await badRequest.WriteAsJsonAsync(new
        {
            Success = false,
            Message = ex.Message,
            Data = (object?)null
        });

        return badRequest;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al actualizar configuración de anuncios");

        var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
        await errorResponse.WriteAsJsonAsync(new
        {
            Success = false,
            Message = "Error al actualizar configuración",
            Data = (object?)null
        });

        return errorResponse;
    }
}
```

---

## 🔧 DEPENDENCY INJECTION

**Ubicación:** `API/Program.cs` o `Startup.cs`

```csharp
// Agregar en ConfigureServices
services.AddScoped<IAdConfigRepository, AdConfigRepository>();
services.AddScoped<IAdConfigService, AdConfigService>();
```

**Ubicación:** `Infrastructure/Data/ApplicationDbContext.cs`

```csharp
// Agregar DbSet
public DbSet<AdConfig> AdConfigs { get; set; }
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Backend

- [ ] Crear entidad `AdConfig` en Domain/Entities
- [ ] Crear migración `AddAdConfigTable`
- [ ] Aplicar migración a base de datos
- [ ] Crear DTOs (Request/Response)
- [ ] Crear interfaz `IAdConfigService`
- [ ] Implementar `AdConfigService` (Application Layer)
- [ ] Crear interfaz `IAdConfigRepository`
- [ ] Implementar `AdConfigRepository` (Infrastructure Layer)
- [ ] Agregar `DbSet<AdConfig>` en DbContext
- [ ] Crear Azure Functions (GET/PUT)
- [ ] Registrar servicios en DI container
- [ ] Testing manual con Postman/Bruno

### Testing

**GET /api/advertisement/config**
```bash
curl https://tu-function-app.azurewebsites.net/api/advertisement/config
```

**PUT /api/advertisement/config**
```bash
curl -X PUT https://tu-function-app.azurewebsites.net/api/advertisement/config \
  -H "Content-Type: application/json" \
  -d '{
    "PostsPerAd": 7,
    "AdMobPercentage": 70
  }'
```

---

## 🎯 RESULTADO ESPERADO

### Response GET /api/advertisement/config

```json
{
  "Success": true,
  "Message": "Configuración obtenida",
  "Data": {
    "PostsPerAd": 5,
    "AdMobPercentage": 60,
    "UpdatedAt": "2025-10-09T14:30:00Z",
    "UpdatedBy": "admin_user_id"
  }
}
```

### Response PUT /api/advertisement/config

```json
{
  "Success": true,
  "Message": "Configuración actualizada",
  "Data": {
    "PostsPerAd": 7,
    "AdMobPercentage": 70,
    "UpdatedAt": "2025-10-09T15:45:00Z",
    "UpdatedBy": "admin_user_id"
  }
}
```

---

## 📊 ARQUITECTURA APLICADA

```
┌─────────────────────────────────────┐
│    Azure Function (API Layer)       │
│  - GET /advertisement/config         │
│  - PUT /advertisement/config         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Application Layer (Business)      │
│  - AdConfigService                   │
│  - Validaciones de negocio           │
│  - Logging y auditoría               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Repository Layer (Data Access)    │
│  - AdConfigRepository                │
│  - EF Core queries                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    Database (Azure SQL)              │
│  - AdConfig table                    │
└─────────────────────────────────────┘
```

---

**Fecha de creación:** 9 de octubre de 2025  
**Status:** ✅ Listo para implementar  
**Estimado:** 45-60 minutos de desarrollo + testing
