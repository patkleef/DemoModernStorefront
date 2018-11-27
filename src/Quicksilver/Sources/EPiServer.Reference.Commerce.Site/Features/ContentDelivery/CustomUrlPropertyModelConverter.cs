using System.Collections.Generic;
using EPiServer.ContentApi.Core.Serialization;
using EPiServer.ContentApi.Core.Serialization.Internal;
using EPiServer.ContentApi.Core.Serialization.Models;
using EPiServer.ServiceLocation;
using EPiServer.SpecializedProperties;

namespace EPiServer.Reference.Commerce.Site.Features.ContentDelivery
{
    [ServiceConfiguration(typeof(IPropertyModelConverter), Lifecycle = ServiceInstanceScope.Singleton)]
    public class CustomUrlPropertyModelConverter : DefaultPropertyModelConverter
    {
        public CustomUrlPropertyModelConverter()
        {
            ModelTypes = new List<TypeModel>
            {
                new TypeModel {
                    ModelType = typeof(CustomUrlPropertyModel), ModelTypeString = nameof(CustomUrlPropertyModel), PropertyType = typeof(PropertyUrl)
                }
            };
        }

        public override int SortOrder { get; } = 100;
    }
}