const SelectPrompt = require("enquirer/lib/prompts/select");

class PreviewSelectPrompt extends SelectPrompt {
  async header() {
    let choice = this.visible[this.index];
    let preview = await this.resolve(choice.preview, this.state, choice, this.index);
    return preview;
  }
}

module.exports = PreviewSelectPrompt;