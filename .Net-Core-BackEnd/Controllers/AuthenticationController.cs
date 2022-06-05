using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using IdentityServerTokenAuth.Data;
using IdentityServerTokenAuth.Data.Helpers;
using IdentityServerTokenAuth.Data.Models;
using IdentityServerTokenAuth.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;

namespace IdentityServerTokenAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowOrigin")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly TokenValidationParameters _tokenValidationParameters;

        public AuthenticationController(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            AppDbContext context,
            IConfiguration configuration,
            TokenValidationParameters tokenValidationParameters)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _configuration = configuration;
            _tokenValidationParameters = tokenValidationParameters;
        }

        [HttpPost("register-user")]
        public async Task<BaseResponse<ApplicationUser>> Register([FromBody]RegisterVM registerVM)
        {
            if (!ModelState.IsValid)
            {
                return BaseResponse<ApplicationUser>.returnError(null,"Check your login information.");
            }

            var userExists = await _userManager.FindByEmailAsync(registerVM.EmailAddress);
            if(userExists != null)
            {
                return new BaseResponse<ApplicationUser>
                {
                    Message = $"User {registerVM.EmailAddress} is already exist, user different email address"
                };
            }

            ApplicationUser newUser = new ApplicationUser()
            {
                FirstName = registerVM.FirstName,
                LastName = registerVM.LastName,
                Email = registerVM.EmailAddress,
                UserName = registerVM.UserName,
                SecurityStamp = Guid.NewGuid().ToString(),
                userRole=registerVM.Role
               
            };
            var result = await _userManager.CreateAsync(newUser, registerVM.Password);
         

            if (result.Succeeded)
            {
                switch (registerVM.Role)
                {
                    case UserRoles.Manager:
                        await _userManager.AddToRoleAsync(newUser, UserRoles.Manager);
                        break;
                    case UserRoles.Student:
                        await _userManager.AddToRoleAsync(newUser, UserRoles.Student);
                        break;
                    default:
                        break;
                }
                
                return BaseResponse<ApplicationUser>.returnSuccess(newUser,$"Welcome {newUser.FirstName}");
            }
            else
            {
                var errorList = new List<string>();
                foreach (var error in result.Errors)
                {
                    errorList.Add(error.Description);
                }

                return BaseResponse<ApplicationUser>.returnError(null, $"{errorList[0]}");
            }
        
           
        }
    
        [HttpPost("login")]
        public async Task<BaseResponse<ApplicationUser>> Login ([FromBody]LoginVM loginVM)
        {
            if (!ModelState.IsValid)
            {
                return BaseResponse<ApplicationUser>.returnError(null, "Check your login information.");
            }

            var userExists = await _userManager.FindByEmailAsync(loginVM.EmailAddress);
            var roles = await _roleManager.Roles.ToListAsync();
            if (userExists != null && await _userManager.CheckPasswordAsync(userExists,loginVM.Password))
            {
                var tokenValue = await GenerateJWTTokenAsync(userExists,null);
                var response = new BaseResponse<ApplicationUser>();
                response.authResult = tokenValue;
                response.StatusCode = System.Net.HttpStatusCode.OK;
                response.role = userExists.userRole;
                foreach (var role in roles)
                {

                    response.userRoles.Add(role.Name);
                  
                }
                return response;

               
             
            }

            return BaseResponse<ApplicationUser>.returnUnauthorized();

        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestVM tokenRequestVM)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please, provide all required fields.");
            }

            var result = await VerifyAndGenerateTokenAsync(tokenRequestVM);

            return Ok(result);
        }

        private async Task<AuthResultVM> VerifyAndGenerateTokenAsync(TokenRequestVM tokenRequestVM)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(i => i.Token == tokenRequestVM.RefreshToken);
            var dbUser = await _userManager.FindByIdAsync(storedToken.UserId);


            try
            {
                var tokenCheckResult = jwtTokenHandler.ValidateToken(tokenRequestVM.Token, _tokenValidationParameters, out var validatedToken);
                return await GenerateJWTTokenAsync(dbUser, storedToken);
            }
            catch (SecurityTokenException)
            {
                if (storedToken.DateExpire>=DateTime.UtcNow)
                {
                    return await GenerateJWTTokenAsync(dbUser, storedToken);
                }
                else
                {
                    return await GenerateJWTTokenAsync(dbUser, null);
                }
            }
        }

        private async Task<AuthResultVM> GenerateJWTTokenAsync(ApplicationUser user,RefreshToken rToken)
        {
            var authClaims = new List<Claim>()
             {
                 new Claim(ClaimTypes.Name,user.UserName),
                 new Claim(ClaimTypes.NameIdentifier,user.Id),
                 new Claim(JwtRegisteredClaimNames.Email,user.Email),
                 new Claim(JwtRegisteredClaimNames.Sub,user.Email),
                 new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
             };

            //Add user role claims

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Secret"],
                audience: _configuration["JWT:Audience"],
                expires: DateTime.UtcNow.AddMinutes(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            var refreshToken = new RefreshToken()
            {
                JwtId = token.Id,
                IsRevoked = false,
                UserId = user.Id,
                DateAdded = DateTime.UtcNow,
                DateExpire = DateTime.UtcNow.AddMonths(6),
                Token = Guid.NewGuid().ToString() + "-" + Guid.NewGuid().ToString()

            };

            await _context.AddAsync(refreshToken);
            await _context.SaveChangesAsync();


            var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            if (rToken !=null)
            {
                var response = new AuthResultVM
                {
                    Token = jwtToken,
                    RefreshToken = rToken.Token,
                    ExpiresAt = token.ValidTo
                };

                return response;

            }

            var res = new AuthResultVM
            {
                Token=jwtToken,
                RefreshToken=refreshToken.Token,
                ExpiresAt=token.ValidTo
            };

            return res;


        }
    }
}
