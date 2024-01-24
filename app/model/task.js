import { Model } from "@nozbe/watermelondb"
import { text, field, writer } from "@nozbe/watermelondb/decorators"

export default class Task extends Model {
  static table = "tasks"

  @writer async toggleChecked() {
    await this.update((task) => {
      task.checked = !task.checked
    })
  }

  @text("title") title
  @field("checked") checked
}
