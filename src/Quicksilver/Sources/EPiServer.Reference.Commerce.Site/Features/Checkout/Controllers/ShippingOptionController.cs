using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using EPiServer.Commerce.Order;
using EPiServer.Reference.Commerce.Site.Features.Cart.Services;
using EPiServer.Reference.Commerce.Site.Features.Cart.ViewModelFactories;
using EPiServer.Reference.Commerce.Site.Features.Cart.ViewModels;
using EPiServer.Reference.Commerce.Site.Features.Product.Models;
using EPiServer.Reference.Commerce.Site.Features.Product.ViewModelFactories;
using EPiServer.Reference.Commerce.Site.Features.Shared.Services;
using EPiServer.Reference.Commerce.Site.Features.Warehouse.Services;
using EPiServer.ServiceApi.Configuration;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Mediachase.Commerce;
using Mediachase.Commerce.Catalog;
using Mediachase.Commerce.Markets;

namespace EPiServer.Reference.Commerce.Site.Features.Product.Controllers
{
    //[AuthorizePermission("EPiServerServiceApi", "ReadAccess")]
    [RoutePrefix("episerverapi/commerce/shipment")]
    public class ShippingOptionController : ApiController
    {
        private readonly IContentRepository _contentRepository;
        private readonly ReferenceConverter _referenceConverter;
        private readonly IPricingService _pricingService;
        private readonly UrlResolver _urlResolver;
        private readonly CatalogContentService _catalogContentService;
        private readonly CatalogEntryViewModelFactory _catalogEntryViewModelFactory;
        private readonly ISiteDefinitionRepository _siteDefinitionRepository;
        private readonly IWarehouseService _warehouseService;
        private readonly ShipmentViewModelFactory _shipmentViewModelFactory;
        private readonly IMarketService _marketService;

        public ShippingOptionController(
            IContentRepository contentRepository, 
            ReferenceConverter referenceConverter,
            IPricingService pricingService,
            UrlResolver urlResolver,
            CatalogContentService catalogContentService,
            CatalogEntryViewModelFactory catalogEntryViewModelFactory,
            ISiteDefinitionRepository siteDefinitionRepository,
            IWarehouseService warehouseService,
            ShipmentViewModelFactory shipmentViewModelFactory,
            IMarketService marketService)
        {
            _contentRepository = contentRepository;
            _referenceConverter = referenceConverter;
            _pricingService = pricingService;
            _urlResolver = urlResolver;
            _catalogContentService = catalogContentService;
            _catalogEntryViewModelFactory = catalogEntryViewModelFactory;
            _siteDefinitionRepository = siteDefinitionRepository;
            _warehouseService = warehouseService;
            _shipmentViewModelFactory = shipmentViewModelFactory;
            _marketService = marketService;
        }

        [ResponseType(typeof(ShippingMethodViewModel[]))]
        //[AuthorizePermission("EPiServerServiceApi", "ReadAccess")]
        [Route("shipping-options", Name = "ShippingOptions")]
        public virtual IHttpActionResult GetProducts()
        {
            var orderGroupFactory = ServiceLocator.Current.GetInstance<IOrderGroupFactory>();
            var cartService = ServiceLocator.Current.GetInstance<ICartService>();
            var shipment = IOrderGroupExtensions.CreateShipment(cartService.LoadOrCreateCart("Dummy"));
            var market = _marketService.GetMarket(new MarketId("US"));
            var models = _shipmentViewModelFactory.CreateShippingMethodViewModels(market.MarketId, market.DefaultCurrency, shipment);

            return Ok(models);
        }
    }
}