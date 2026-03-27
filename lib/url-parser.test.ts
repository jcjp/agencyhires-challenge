import { describe, it, expect } from "vite-plus/test";
import { parseChannelUrl, InvalidChannelUrlError } from "./url-parser";

describe("parseChannelUrl", () => {
  it("parses bare channel ID", () => {
    const result = parseChannelUrl("UCBcRF18a7Qf58cCRy5xuWwQ");
    expect(result).toEqual({ type: "id", value: "UCBcRF18a7Qf58cCRy5xuWwQ" });
  });

  it("parses bare @handle", () => {
    const result = parseChannelUrl("@MrBeast");
    expect(result).toEqual({ type: "handle", value: "@MrBeast" });
  });

  it("parses /channel/ URL", () => {
    const result = parseChannelUrl("https://youtube.com/channel/UCBcRF18a7Qf58cCRy5xuWwQ");
    expect(result).toEqual({ type: "id", value: "UCBcRF18a7Qf58cCRy5xuWwQ" });
  });

  it("parses /@handle URL", () => {
    const result = parseChannelUrl("https://www.youtube.com/@MrBeast");
    expect(result).toEqual({ type: "handle", value: "@MrBeast" });
  });

  it("parses /user/ URL", () => {
    const result = parseChannelUrl("https://youtube.com/user/SomeUser");
    expect(result).toEqual({ type: "username", value: "SomeUser" });
  });

  it("parses /c/ custom URL", () => {
    const result = parseChannelUrl("https://youtube.com/c/customname");
    expect(result).toEqual({ type: "search", value: "customname" });
  });

  it("parses URL without protocol prefix", () => {
    const result = parseChannelUrl("youtube.com/@Fireship");
    expect(result).toEqual({ type: "handle", value: "@Fireship" });
  });

  it("throws InvalidChannelUrlError for non-YouTube URL", () => {
    expect(() => parseChannelUrl("https://vimeo.com/channel/123")).toThrow(InvalidChannelUrlError);
  });

  it("throws InvalidChannelUrlError for video URL", () => {
    expect(() => parseChannelUrl("https://youtube.com/watch?v=dQw4w9WgXcQ")).toThrow(
      InvalidChannelUrlError,
    );
  });

  it("throws InvalidChannelUrlError for empty string", () => {
    expect(() => parseChannelUrl("   ")).toThrow(InvalidChannelUrlError);
  });
});
