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
//using System.Collections.Generic;

namespace Creme.API
{

    public class ProductRepository : IDisposable
    {
        private CremeContext _ctx;

        public ProductRepository()
        {
            _ctx = new CremeContext();
        }

        public async Task<List<CategoryProduct>> SelectCategoryProductList()
        {
            var result = await _ctx.SqlQueryList<CategoryProduct>("dbo.USP_SelectCategoryProductList");
            return result;
        }

        public async Task<List<BrandProduct>> SelectBrandProductList()
        {
            var result = await _ctx.SqlQueryList<BrandProduct>("dbo.USP_SelectBrandProductList");
            return result;
        }


        public async Task<long> InsertProduct(Product p)
        {
            var parameters = new object[]
            {
                new SqlParameter("@CATEGORY_CD", p.CategoryCd),
                new SqlParameter("@BRAND_CD", p.BrandCd),
                new SqlParameter("@STATUS_CD", p.StatusCd),
                new SqlParameter("@ITEM_CD", p.ItemCd),
                new SqlParameter("@ORIGINAL_BARCODE", p.OriginalBarCode),
                new SqlParameter("@PRODUCT_TYPE", p.ProductType),
                new SqlParameter("@DESCRIPTION", p.Description),
                new SqlParameter("@PURCHASED_DESCRIPTION", p.PurchasedDescription),
                new SqlParameter("@COST", p.Cost),
                new SqlParameter("@PRICE", p.Price),
                new SqlParameter("@IMAGE_URL", p.ImageUrl),
                new SqlParameter("@COUNTRY_ORIGIN", p.CountryOrigin),
                new SqlParameter("@INS_OPRT", p.InsOprt)
            };
            var result = await _ctx.Database.ExecuteSqlCommandAsync("dbo.USP_InsertProduct", parameters);
            return result;
        }

        public void Dispose()
        {
            _ctx.Dispose();

        }
    }
}