import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { htmlSafe } from "@ember/template";

export default class CustomCategoryBanner extends Component {
  @service router;

  get category() {
    return this.router.currentRoute?.attributes?.category;
  }

  get tag() {
    return this.router.currentRoute?.attributes?.tag;
  }

  get bannerBg() {
    const schemeType = getComputedStyle(document.body)
    .getPropertyValue("--scheme-type")
    .trim();

    // console.log(schemeType);

    if (schemeType == "dark") {
      if (this.category.uploaded_background_dark?.url != nil) {
        const background_url = this.category.uploaded_background_dark?.url
      }

    }
    else {
      const background_url = this.category.uploaded_background?.url
    }

    return htmlSafe(
      `background: url("${background_url}");
     background-size: cover; 
     background-position: center center;;`
    );


  }

  get categoryBgColor() {
    return htmlSafe(
      `background-color: var(--category-${this.category.id}-color);`
    );
  }

  get categoryTextColor() {
    return htmlSafe(`color: ${this.category.text_color};`);
  }
}