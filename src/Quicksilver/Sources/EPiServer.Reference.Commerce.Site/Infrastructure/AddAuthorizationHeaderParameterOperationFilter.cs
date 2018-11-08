using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.Filters;
using Swashbuckle.Swagger;

namespace EPiServer.Reference.Commerce.Site.Infrastructure
{
    public class AddAuthorizationHeaderParameterOperationFilter : IOperationFilter
    {
        public void Apply(Operation operation, SchemaRegistry schemaRegistry, ApiDescription apiDescription)
        {
            var filterPipeline = apiDescription.ActionDescriptor.GetFilterPipeline();
            var isAuthorized = filterPipeline
                                   .Select(filterInfo => filterInfo.Instance)
                                   .Any(filter => filter is IAuthorizationFilter);

            var allowAnonymous = apiDescription.ActionDescriptor
                .GetCustomAttributes<AllowAnonymousAttribute>()
                .Any();

            if (operation.parameters == null)
            {
                operation.parameters = new List<Parameter>();
            }

            if (isAuthorized && !allowAnonymous)
            {
                operation.parameters.Add(new Parameter
                {
                    name = "Authorization",
                    @in = "header",
                    description = "Bearer token (e.g. BEARER enterbearertokenhere)",
                    required = false,
                    type = "string"
                });
            }
        }
    }
}