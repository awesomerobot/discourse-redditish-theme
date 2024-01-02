import Component from "@glimmer/component";
import { inject as service } from "@ember/service";

// const schemeType = getComputedStyle(document.body)
// .getPropertyValue("--scheme-type")
// .trim();

export default class CustomCategoryBanner extends Component {
  @service router;

  get category() {
    return this.router.currentRoute?.attributes?.category;
  }

  get tag() {
    return this.router.currentRoute?.attributes?.tag;
  }

  get bannerBg() {
    
    return htmlSafe(
      `background: url("${this.category.uploaded_background?.url}");
     background-size: cover; 
     background-position: center center;;`
    );

    // if (schemeType == "dark") {
    //   return htmlSafe(
    //     `background: url("${this.category.uploaded_background_dark?.url}");
    //      background-size: cover; 
    //      background-position: center center;;`
    //   );

    // }
    // else {
    //   return htmlSafe(
    //     `background: url("${this.category.uploaded_background?.url}");
    //    background-size: cover; 
    //    background-position: center center;;`
    //   );
    // }
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
