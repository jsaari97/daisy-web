import { mount, tick, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAudioForElement: vi.fn(),
  loadFile: vi.fn(),
}));

vi.mock("./reader/audio", () => ({
  getAudioSource: () => mocks.getAudioForElement,
}));

vi.mock("./reader/loader", () => ({
  loadFile: mocks.loadFile,
}));

import App from "./App.svelte";

describe("App keyboard controls", () => {
  let component;
  let target;

  beforeEach(() => {
    mocks.loadFile.mockReset();
    mocks.getAudioForElement.mockReset();

    target = document.createElement("div");
    document.body.appendChild(target);

    const wrapper = document.createElement("div");
    const documentRoot = document.createElement("div");
    documentRoot.innerHTML = '<p smilref="chapter.smil#first">First</p>';
    wrapper.appendChild(documentRoot);

    mocks.loadFile.mockResolvedValue({ dom: documentRoot, zip: {} });
    mocks.getAudioForElement.mockResolvedValue("first.mp3");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(new Blob()),
      })
    );

    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  });

  afterEach(async () => {
    if (component) {
      await unmount(component);
      component = undefined;
    }

    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("pauses with Space without restarting from the document root", async () => {
    component = mount(App, { target });

    target.querySelector("button").click();
    await vi.waitFor(() => {
      expect(target.querySelector("#content")).not.toBeNull();
    });
    await tick();

    const content = target.querySelector("#content");
    const firstPhrase = content.querySelector("p");
    firstPhrase.click();
    await Promise.resolve();

    expect(mocks.getAudioForElement).toHaveBeenCalledTimes(1);
    expect(mocks.getAudioForElement).toHaveBeenLastCalledWith(firstPhrase);

    content.focus();
    content.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        code: "Space",
        key: " ",
      })
    );
    await Promise.resolve();

    expect(mocks.getAudioForElement).toHaveBeenCalledTimes(1);
    expect(target.querySelector('[aria-label="Play"]')).not.toBeNull();
  });
});
