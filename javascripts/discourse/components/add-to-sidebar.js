import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action, set } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class AddToSidebar extends Component {
  @service currentUser;
  @tracked saved = false;
  @tracked isInSidebar = this._isInSidebar();

  saveAttrNames = ["sidebar_category_ids", "sidebar_tag_names"];

  get shouldNotRender() {
    const category = this.args.category;
    const tag = this.args.tag;
    return (category && tag) || (!category && !tag);
  }

  _isInSidebar() {
    const category = this.args.category;
    const tag = this.args.tag;

    return (
      (category &&
        this.currentUser.sidebar_category_ids.includes(category.id)) ||
      (tag &&
        this.currentUser.sidebar_tags.some(
          (savedTag) => savedTag.name === this.args.tag.name
        ))
    );
  }

  get buttonIcon() {
    return this.isInSidebar ? "star" : "far-star";
  }

  @action
  toggleInSidebar() {
    let sidebarCategories = this.currentUser.sidebar_category_ids;
    let sidebarTags = this.currentUser.sidebar_tags;

    if (this.args.category) {
      let categoryId = this.args.category.id;
      if (sidebarCategories.includes(categoryId)) {
        sidebarCategories = sidebarCategories.filter((id) => id !== categoryId);
      } else {
        sidebarCategories = [...sidebarCategories, categoryId];
      }

      set(this.currentUser, "sidebar_category_ids", sidebarCategories);
    } else if (this.args.tag) {
      let sidebarTagNames = sidebarTags.map((tag) => tag.name);
      let tagIsMatched = sidebarTags.some(
        (tag) => tag.name === this.args.tag.name
      );

      if (tagIsMatched) {
        sidebarTagNames = sidebarTagNames.filter(
          (name) => name !== this.args.tag.name
        );
      } else {
        sidebarTagNames.push(this.args.tag.name);
      }

      sidebarTags = sidebarTagNames.map((name) => {
        return { name };
      });
      set(this.currentUser, "sidebar_tag_names", sidebarTagNames);
    }

    return this.currentUser
      .save(this.saveAttrNames)
      .then((result) => {
        this.saved = true;

        if (result.user.sidebar_tags) {
          set(this.currentUser, "sidebar_tags", result.user.sidebar_tags);
        }

        this.isInSidebar = this._isInSidebar(); // need to manually udpate
      })
      .catch((error) => {
        console.error("Error updating sidebar:", error);
        this.saved = false;
      })
      .finally(() => {});
  }
}
