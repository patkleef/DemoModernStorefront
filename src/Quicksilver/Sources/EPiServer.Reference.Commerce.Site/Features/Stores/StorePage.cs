using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Web;

namespace EPiServer.Reference.Commerce.Site.Features.Stores
{
    [ContentType(DisplayName = "Store page", GUID = "95FEF7B2-B0F3-4E7C-96C3-77EAA74EEF20", Description = "", AvailableInEditMode = true)]
    public class StorePage : PageData
    {
        [CultureSpecific]
        [Display(
               Name = "Name of the store",
               GroupName = SystemTabNames.Content,
               Order = 1)]
        public virtual string StoreName { get; set; }

        [CultureSpecific]
        [Display(
               Name = "Header",
               GroupName = SystemTabNames.Content,
               Order = 1)]
        public virtual string Header { get; set; }

        [CultureSpecific]
        [Display(
            Name = "Body",
            Description = "",
            GroupName = SystemTabNames.Content,
            Order = 7)]
        public virtual XhtmlString MainBody { get; set; }
        
        [UIHint(UIHint.Image)]
        [Display(
            Name = "Main image",
            Description = "",
            GroupName = SystemTabNames.Content,
            Order = 8)]
        public virtual Url MainImage { get; set; }
    }
}