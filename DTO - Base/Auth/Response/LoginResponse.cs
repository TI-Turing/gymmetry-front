

namespace Gymmetry.Domain.DTO.Auth.Response
{
    public class LoginResponse
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime TokenExpiration { get; set; }
        public DateTime RefreshTokenExpiration { get; set; }
        public Models.User User { get; set; } = new Models.User();
    }
}