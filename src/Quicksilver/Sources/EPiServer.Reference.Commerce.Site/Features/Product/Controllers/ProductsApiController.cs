using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;
using EPiServer.Reference.Commerce.Site.Features.Product.Models;
using EPiServer.ServiceApi.Configuration;
using Mediachase.Commerce.Catalog;

namespace EPiServer.Reference.Commerce.Site.Features.Product.Controllers
{
    [AuthorizePermission("EPiServerServiceApi", "ReadAccess")]
    [RoutePrefix("episerverapi/commerce/catalog/products")]
    public class ProductsController : ApiController
    {
        private readonly IContentRepository _contentRepository;
        private readonly ReferenceConverter _referenceConverter;

        public ProductsController(IContentRepository contentRepository, ReferenceConverter referenceConverter)
        {
            _contentRepository = contentRepository;
            _referenceConverter = referenceConverter;
        }

        [ResponseType(typeof(Product[]))]
        [AuthorizePermission("EPiServerServiceApi", "ReadAccess")]
        [Route("", Name = "Products")]
        public virtual IHttpActionResult GetProducts()
        {
            var contentLink = _referenceConverter.GetContentLink("shoes");
            var category = _contentRepository.Get<FashionNode>(contentLink);

            var list = new List<Product>();

            foreach (var item in _contentRepository.GetChildren<FashionProduct>(category.ContentLink))
            {
                var product = new Product
                {
                    Code = item.Code,
                    Title = item.DisplayName,
                    Description = item.Description.ToHtmlString()
                };
                list.Add(product);
            }

            return Ok(list);
        }
    }

    public class Product
    {
        public string Code { get; set; }
        public string Brand { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string LargeImage { get; set; }
        public double Price { get; set; }
        public double SalePrice { get; set; }
        public ProductSize[] Sizes { get; set; }
    }

    public class ProductSize
    {
        public int Size { get; set; }
        public ProductSizeStock[] Stock { get; set; }
    }

    public class ProductSizeStock
    {
        public int StoreId { get; set; }
        public string StoreName { get; set; }
    }
}