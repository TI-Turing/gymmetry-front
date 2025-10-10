# 🔧 Prompt para Backend - Campo IsLiked en Feed

## Contexto
El frontend necesita saber si el usuario actual dio like a cada feed para mostrar el corazón coloreado.

## Necesidades del Frontend

### 1. Campo requerido en GET /feed/unviewed
Cuando el backend devuelve la lista de feeds en `/feed/unviewed`, cada objeto Feed debe incluir:

```csharp
public class FeedDto
{
    public string Id { get; set; }
    public string UserId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    // ... otros campos existentes ...
    
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public int SharesCount { get; set; }
    
    // ⚠️ CAMPO CRÍTICO: Flag indicando si el usuario actual dio like
    public bool IsLiked { get; set; }  // o IsLikedByCurrentUser
    
    // Opcional pero útil:
    public string? UserLikeId { get; set; }  // ID del FeedLike si existe
}
```

### 2. Lógica de población
En el Application Layer, al obtener feeds para un usuario:

```csharp
// Pseudo-código
var feeds = await _repository.GetUnviewedFeeds(userId, page, size);
var currentUserId = GetCurrentUserId(); // Del token/auth

foreach (var feed in feeds)
{
    // Verificar si el usuario actual tiene un like activo en este feed
    feed.IsLiked = await _repository.UserHasLikedFeed(feed.Id, currentUserId);
    
    // O de manera optimizada con un JOIN:
    // SELECT f.*, (CASE WHEN fl.Id IS NOT NULL THEN 1 ELSE 0 END) as IsLiked
    // FROM Feed f
    // LEFT JOIN FeedLike fl ON f.Id = fl.FeedId AND fl.UserId = @currentUserId AND fl.IsActive = 1
}
```

### 3. Endpoints afectados
Todos estos endpoints deben incluir el flag `IsLiked`:
- `GET /feed/unviewed` ✅ CRÍTICO
- `GET /feed/paged` ✅
- `GET /feed/user/{userId}/paged` ✅
- `GET /feed/trending` ✅
- `GET /feed/{id}` ✅

### 4. Verificación
Para confirmar que funciona, el frontend espera en la respuesta JSON:

```json
{
  "Success": true,
  "Data": {
    "Items": [
      {
        "Id": "123-456",
        "UserId": "user-1",
        "Description": "Post de prueba",
        "LikesCount": 5,
        "CommentsCount": 2,
        "IsLiked": true,  // ⬅️ OPCIÓN 1: Campo booleano (PREFERIDO)
        "FeedLikes": [],  // Array vacío o con el like del usuario actual
        "CreatedAt": "2025-01-09T10:00:00Z"
      }
    ]
  }
}
```

**OPCIÓN ALTERNATIVA**: Si no quieres agregar el campo `IsLiked`, puedes llenar `FeedLikes` solo con el like del usuario actual:

```json
{
  "FeedLikes": [
    {
      "Id": "like-123",
      "UserId": "current-user-id",
      "FeedId": "123-456",
      "IsActive": true
    }
  ]
}
```

**IMPORTANTE**: Actualmente el array `FeedLikes` llega vacío `[]` incluso cuando el usuario dio like al post. Necesitas incluir el like del usuario actual en este array o agregar el campo booleano `IsLiked`.

### 5. Nombres alternativos aceptados
El frontend puede mapear cualquiera de estos nombres:
- `IsLiked` ✅ Preferido
- `IsLikedByCurrentUser` ✅ También funciona
- `LikedByCurrentUser` ✅ También funciona
- `isLiked` ✅ (camelCase también)

## Consulta
¿Qué campo exacto está enviando el backend actualmente? ¿Necesitas ayuda para implementar esta lógica?
