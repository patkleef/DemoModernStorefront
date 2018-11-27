using System.Linq;
using EPiServer.ContentApi.Core.Serialization.Models;
using EPiServer.ServiceLocation;
using EPiServer.SpecializedProperties;
using EPiServer.Web;
using EPiServer.Web.Routing;

namespace EPiServer.Reference.Commerce.Site.Features.ContentDelivery
{
    public class CustomUrlPropertyModel : PropertyModel<string, PropertyUrl>
    {
        protected Injected<IUrlResolver> _urlResolver;
        protected Injected<ISiteDefinitionRepository> _siteDefinitionRepository;

        public CustomUrlPropertyModel(PropertyUrl propertyUrl) : base(propertyUrl)
        {
            var baseUrl = _siteDefinitionRepository.Service.List().FirstOrDefault()?.SiteUrl;
            base.Value = baseUrl + _urlResolver.Service.GetUrl(propertyUrl.ToString());
        }
    }
}