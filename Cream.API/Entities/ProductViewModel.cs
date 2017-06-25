using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Creme.API.Entities
{
    public class BrandProduct
    {
        [Column("BRAND_CD")]
        public string BrandCd { get; set; }
        [Column("Brand_Nm")]
        public string BrandNm { get; set; }
        [Column("Use_Yn")]
        public string UseYn { get; set; }
    }

    public class CategoryProduct
    {
        [Column("CATEGORY_CD")]
        public string CategoryCd { get; set; }
        [Column("CATEGORY_Nm")]
        public string CategoryNm { get; set; }
        [Column("Use_Yn")]
        public string UseYn { get; set; }
    }

    public class Product
    {
        [Column("PRODUCT_NO")]
        public int ProductNo { get; set; }

        [Column("CATEGORY_CD")]
        public string CategoryCd { get; set; }

        [Column("BRAND_CD")]
        public string BrandCd { get; set; }

        [Column("STATUS_CD")]
        public string StatusCd { get; set; }

        [Column("ITEM_CD")]
        public string ItemCd { get; set; }

        [Column("SKU_CD")]
        public string SkuCd { get; set; }

        [Column("ORIGINAL_BARCODE")]
        public string OriginalBarCode { get; set; }

        [Column("PRODUCT_TYPE")]
        public string ProductType { get; set; }

        [Column("DESCRIPTION")]
        public string Description { get; set; }

        [Column("PURCHASED_DESCRIPTION")]
        public string PurchasedDescription { get; set; }

        [Column("COST")]
        public decimal Cost { get; set; }

        [Column("PRICE")]
        public decimal Price { get; set; }

        [Column("IMAGE_URL")]
        public string ImageUrl { get; set; }

        [Column("COUNTRY_ORIGIN")]
        public string CountryOrigin { get; set; }

        [Column("INS_OPRT")]
        public string InsOprt { get; set; }

        [Column("INS_DATE")]
        public DateTime InsDate { get; set; }

        [Column("UPD_OPRT")]
        public string UpdOprt { get; set; }

        [Column("UPD_DATE")]
        public DateTime UpdDate { get; set; }
    }

}