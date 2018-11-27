using EPiServer.ContentApi.Cms;
using EPiServer.ContentApi.Core.Configuration;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;

namespace EPiServer.Reference.Commerce.Site.Features.ContentDelivery
{
    [ModuleDependency(typeof(ContentApiCmsInitialization))]

    public class ContentDeliveryApiInitialization : IConfigurableModule
    {
        public void Initialize(InitializationEngine context)
        {
        }

        public void Uninitialize(InitializationEngine context)
        {

        }

        public void ConfigureContainer(ServiceConfigurationContext context)
        {
            context.Services.Configure<ContentApiConfiguration>(config =>
            {
                config.Default()
                    .SetMinimumRoles("") //contentapiread
                    .SetRequiredRole("WebAdmins") // WebAdmins
                    .SetSiteDefinitionApiEnabled(true)
                    .SetMultiSiteFilteringEnabled(false);
            });
        }
    }
}