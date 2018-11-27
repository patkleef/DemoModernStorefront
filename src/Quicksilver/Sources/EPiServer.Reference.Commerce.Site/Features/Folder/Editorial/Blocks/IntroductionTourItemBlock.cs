using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Web;

namespace EPiServer.Reference.Commerce.Site.Features.Folder.Editorial.Blocks
{
    [ContentType(DisplayName = "Introduction tour block", GUID = "33756F84-808A-4663-B37E-A58749B853FC", Description = "")]
    public class IntroductionTourItemBlock : BlockData
    {
        [CultureSpecific]
        [Display(
            Name = "Title",
            Description = "",
            GroupName = SystemTabNames.Content,
            Order = 1)]
        public virtual string Title { get; set; }

        [CultureSpecific]
        [Display(
            Name = "Main body",
            Description = "",
            GroupName = SystemTabNames.Content,
            Order = 2)]
        public virtual XhtmlString MainBody { get; set; }

        [UIHint(UIHint.Image)]
        [Display(
            Name = "Image",
            Description = "",
            GroupName = SystemTabNames.Content,
            Order = 9)]
        public virtual Url MainImage { get; set; }
    }
}