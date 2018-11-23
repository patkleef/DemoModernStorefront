using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using EPiServer.Reference.Commerce.Site.Features.Product.Models;
using EPiServer.Reference.Commerce.Site.Features.Product.ViewModelFactories;
using EPiServer.Reference.Commerce.Site.Features.Shared.Services;
using EPiServer.Reference.Commerce.Site.Features.Warehouse.Services;
using EPiServer.ServiceApi.Configuration;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Mediachase.Commerce.Catalog;

namespace EPiServer.Reference.Commerce.Site.Features.Product.Controllers
{
    //[AuthorizePermission("EPiServerServiceApi", "ReadAccess")]
    [RoutePrefix("episerverapi/commerce/catalog/products")]
    public class ProductsController : ApiController
    {
        private readonly IContentRepository _contentRepository;
        private readonly ReferenceConverter _referenceConverter;
        private readonly IPricingService _pricingService;
        private readonly UrlResolver _urlResolver;
        private readonly CatalogContentService _catalogContentService;
        private readonly CatalogEntryViewModelFactory _catalogEntryViewModelFactory;
        private readonly ISiteDefinitionRepository _siteDefinitionRepository;
        private readonly IWarehouseService _warehouseService;

        public ProductsController(
            IContentRepository contentRepository, 
            ReferenceConverter referenceConverter,
            IPricingService pricingService,
            UrlResolver urlResolver,
            CatalogContentService catalogContentService,
            CatalogEntryViewModelFactory catalogEntryViewModelFactory,
            ISiteDefinitionRepository siteDefinitionRepository,
            IWarehouseService warehouseService)
        {
            _contentRepository = contentRepository;
            _referenceConverter = referenceConverter;
            _pricingService = pricingService;
            _urlResolver = urlResolver;
            _catalogContentService = catalogContentService;
            _catalogEntryViewModelFactory = catalogEntryViewModelFactory;
            _siteDefinitionRepository = siteDefinitionRepository;
            _warehouseService = warehouseService;
        }

        [ResponseType(typeof(Product[]))]
        //[AuthorizePermission("EPiServerServiceApi", "ReadAccess")]
        [Route("", Name = "Products")]
        public virtual IHttpActionResult GetProducts()
        {
            
            var contentLink = _referenceConverter.GetContentLink("shoes");
            var category = _contentRepository.Get<FashionNode>(contentLink);

            var list = new List<Product>();

            foreach (var item in _contentRepository.GetChildren<FashionProduct>(category.ContentLink))
            {
                
                list.Add(GetByCode(item));
            }

            return Ok(list);
        }

        [ResponseType(typeof(Product))]
        //[AuthorizePermission("EPiServerServiceApi", "ReadAccess")]
        [Route("{code}", Name = "Product")]
        public virtual IHttpActionResult GetProduct(string code)
        {
            var contentLink = _referenceConverter.GetContentLink(code);
            var fashionProduct = _contentRepository.Get<FashionProduct>(contentLink);

            return Ok(GetByCode(fashionProduct));
        }


        private Product GetByCode(FashionProduct item)
        {
            var siteUrl = _siteDefinitionRepository.List().FirstOrDefault()?.SiteUrl;

            var variants = _catalogContentService.GetVariants<FashionVariant>(item).ToList();
            var defaultVariant = variants.FirstOrDefault();

            var viewModel = _catalogEntryViewModelFactory.Create(item, defaultVariant?.Code);
            var product = new Product
            {
                Code = item.Code,
                Title = item.DisplayName,
                Description = item.Description.ToHtmlString(),
                Price = viewModel.ListingPrice.Amount,
                SalePrice = viewModel.DiscountedPrice?.Amount ?? 0,
                Brand = viewModel.Product.Brand,
                Image = siteUrl + viewModel.Images?.FirstOrDefault(),
                LargeImage = siteUrl + viewModel.Images?.FirstOrDefault()
            };

            var sizes = new List<ProductSize>();
            foreach (var variant in variants)
            {
                sizes.Add(new ProductSize
                {
                    Size = variant.Size,
                    Stock =
                        _warehouseService.GetWarehouseAvailability(variant.Code)?.Select(x => new ProductSizeStock
                        {
                            StorePageId = 295,
                            StoreCode = x?.Warehouse?.Code,
                            StoreName = x?.Warehouse?.Name,
                            Available = (int)x?.InStock
                        }).ToArray()
                });
            }
            product.Sizes = sizes.ToArray();
            return product;
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
        public decimal Price { get; set; }
        public decimal SalePrice { get; set; }
        public ProductSize[] Sizes { get; set; }
    }

    public class ProductSize
    {
        public string Size { get; set; }
        public ProductSizeStock[] Stock { get; set; }
    }

    public class ProductSizeStock
    {
        public int StorePageId { get; set; }
        public string StoreCode { get; set; }
        public string StoreName { get; set; }
        public int Available { get; set; }
    }
}