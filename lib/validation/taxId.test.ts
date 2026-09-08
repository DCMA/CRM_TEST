import { describe, expect, it } from "vitest";
import { isValidTaxId } from "./taxId";

describe("isValidTaxId", () => {
  it("accepts a valid 8-digit tax ID with no carry", () => {
    expect(isValidTaxId("10000009")).toBe(true);
  });

  it("accepts a valid 8-digit tax ID where a weighted product carries", () => {
    expect(isValidTaxId("48000009")).toBe(true);
  });

  it("accepts a valid tax ID using the 7th-digit-is-7 special case", () => {
    // digits: 1,0,0,0,0,0,7,8 — weights [1,2,1,2,1,2,4,1]
    // running sum (with carry-fold) = 1 + 0+0+0+0+0 + (7*4=28 -> 2+8=10) + 8 = 19
    // 19 % 10 !== 0 (fails the base rule) but (19 + 1) % 10 === 0, so the
    // 7th-digit-is-7 special case is what makes this one valid.
    expect(isValidTaxId("10000078")).toBe(true);
  });

  it("rejects an 8-digit number that fails the checksum", () => {
    expect(isValidTaxId("48000000")).toBe(false);
  });

  it("rejects strings that are not exactly 8 digits", () => {
    expect(isValidTaxId("1234567")).toBe(false);
    expect(isValidTaxId("123456789")).toBe(false);
  });

  it("rejects strings containing non-digit characters", () => {
    expect(isValidTaxId("1234567a")).toBe(false);
    expect(isValidTaxId("")).toBe(false);
  });
});
