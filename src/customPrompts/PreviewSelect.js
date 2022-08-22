import SelectPrompt from "enquirer/lib/prompts/select";
import utils from "enquirer/lib/utils";

export default class PreviewSelectPrompt extends SelectPrompt {
  async header() {
    let choice = this.visible[this.index];
    let preview = await this.resolve(choice.preview, this.state, choice, this.index);
    return preview;
  }
}
