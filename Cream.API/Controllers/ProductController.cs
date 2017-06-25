using Creme.API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;

namespace Creme.API.Controllers
{
    [RoutePrefix("api/product")]
    public class ProductController : ApiController
    {
        private ProductRepository _repo = null;


        public ProductController()
        {
            _repo = new ProductRepository();
        }
        
        [Authorize]
        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetCategoryProductList()
        {
            List<CategoryProduct> list = await _repo.SelectCategoryProductList();
            return Json(list);
        }


        [Authorize]
        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetBrandProductList()
        {
            List<BrandProduct> list = await _repo.SelectBrandProductList();
            return Json(list);
        }


        [Authorize]
        [Route("")]
        public async Task<IHttpActionResult> SetProduct(Product p)
        {
            long result = await _repo.InsertProduct(p);
            return Json(result);
        }



    }
}
