import { describe, it, expect } from "vite-plus/test";
import { median, formatSubscriberCount, formatNumber, parseDuration } from "./normalize";

describe("median", () => {
  it("returns 0 for empty array", () => {
    expect(median([])).toBe(0);
  });

  it("returns single value", () => {
    expect(median([42])).toBe(42);
  });

  it("returns middle of odd-length array", () => {
    expect(median([1, 3, 5])).toBe(3);
  });

  it("returns average of two middle values for even-length array", () => {
    expect(median([1, 3, 5, 7])).toBe(4);
  });

  it("handles unsorted input", () => {
    expect(median([9, 1, 5, 3, 7])).toBe(5);
  });
});

describe("formatSubscriberCount", () => {
  it("formats millions", () => {
    expect(formatSubscriberCount(1_200_000)).toBe("1.2M");
  });

  it("formats thousands", () => {
    expect(formatSubscriberCount(45_000)).toBe("45K");
  });

  it("formats small numbers", () => {
    expect(formatSubscriberCount(999)).toBe("999");
  });
});

describe("parseDuration", () => {
  it("parses minutes and seconds", () => {
    expect(parseDuration("PT4M13S")).toBe("4:13");
  });

  it("parses hours minutes seconds", () => {
    expect(parseDuration("PT1H2M3S")).toBe("1:02:03");
  });

  it("pads single-digit seconds", () => {
    expect(parseDuration("PT1M5S")).toBe("1:05");
  });

  it("handles seconds only", () => {
    expect(parseDuration("PT30S")).toBe("0:30");
  });
});

describe("formatNumber", () => {
  it("formats with commas", () => {
    expect(formatNumber(1_234_567)).toBe("1,234,567");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});
