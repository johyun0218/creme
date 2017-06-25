using Creme.API.Entities;
using Creme.API.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace Creme.API
{

    public class CremeRepository : IDisposable
    {
        private CremeContext _ctx;

        public CremeRepository()
        {
            _ctx = new CremeContext();
        }

        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            List<string> errors = new List<string>();
            try
            {
                var ret = await _ctx.Database.ExecuteSqlCommandAsync("USP_InsertEmployee @USER_NAME, @SECRET", new SqlParameter("@USER_NAME", userModel.UserName), new SqlParameter("@SECRET", Helper.GetHash(userModel.Password)));
            }
            catch(Exception e)
            {
                errors.Add(e.Message);
            }
            IdentityResult result = new IdentityResult(errors);
            return result;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            IdentityUser user = null;
            try
            {
                var ret = await _ctx.Database.ExecuteSqlCommandAsync("USP_SelectEmployeeLogin @USER_NAME, @SECRET", new SqlParameter("@USER_NAME", userName), new SqlParameter("@SECRET", Helper.GetHash(password)));
                user = new IdentityUser();
            }
            catch (Exception)
            {
            }
            return user;
        }

        public Client FindClient(string clientId)
        {
            var client = _ctx.Clients.Find(clientId);

            return client;
        }

        public async Task<bool> AddRefreshToken(RefreshToken token)
        {

           var existingToken = _ctx.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

           if (existingToken != null)
           {
             var result = await RemoveRefreshToken(existingToken);
           }
          
            _ctx.RefreshTokens.Add(token);

            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveRefreshToken(string refreshTokenId)
        {
           var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

           if (refreshToken != null) {
               _ctx.RefreshTokens.Remove(refreshToken);
               return await _ctx.SaveChangesAsync() > 0;
           }

           return false;
        }

        public async Task<bool> RemoveRefreshToken(RefreshToken refreshToken)
        {
            _ctx.RefreshTokens.Remove(refreshToken);
             return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<RefreshToken> FindRefreshToken(string refreshTokenId)
        {
            var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

            return refreshToken;
        }

        public List<RefreshToken> GetAllRefreshTokens()
        {
             return  _ctx.RefreshTokens.ToList();
        }

        public async Task<IdentityUser> FindAsync(UserLoginInfo loginInfo)
        {
            //IdentityUser user = await _userManager.FindAsync(loginInfo);

            //return user;
            return null;
        }

        public async Task<IdentityResult> CreateAsync(IdentityUser user)
        {
            //var result = await _userManager.CreateAsync(user);

            //return result;
            return null;
        }

        public async Task<IdentityResult> AddLoginAsync(string userId, UserLoginInfo login)
        {
            //var result = await _userManager.AddLoginAsync(userId, login);

            //return result;
            return null;
        }

        public void Dispose()
        {
            _ctx.Dispose();

        }
    }
}