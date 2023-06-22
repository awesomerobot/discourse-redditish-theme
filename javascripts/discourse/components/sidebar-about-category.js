import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { NotificationLevels } from "discourse/lib/notification-levels";
import { bind } from "discourse-common/utils/decorators";
import Composer from "discourse/models/composer";

export default class LatestTopicsSidebar extends Component {
  @service site;
  @service router;
  @service currentUser;
  @service composer;
  @tracked topTags = this.site.category_top_tags;
  @tracked categoryNotificationLevel;

  get category() {
    return this.router.currentRoute?.attributes?.category;
  }

  get showTopicsForSubCategory() {
    if (!this.category.subcategories) {
      return false;
    }

    return this.category.subcategory_list_style.includes("topics");
  }

  @action
  async changeCategoryNotificationLevel(notificationLevel) {
    await this.category.setNotification(notificationLevel);
    this.updateCategoryNotificationLevel();
  }

  @action
  customCreateTopic() {
    this.composer.openComposer({
      action: Composer.CREATE_TOPIC,
      draftKey: Composer.NEW_TOPIC_KEY,
      categoryId: this.category?.id,
      tags: this.tag?.id,
    });
  }

  @bind
  updateCategoryNotificationLevel() {
    if (
      this.currentUser?.indirectly_muted_category_ids?.includes(
        this.category.id
      )
    ) {
      this.categoryNotificationLevel = NotificationLevels.MUTED;
    } else {
      this.categoryNotificationLevel = this.category.notification_level;
    }
  }
}
