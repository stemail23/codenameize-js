import { codenamize } from "../src"; // Replace with the actual module path
import particles, { adjectives, nouns } from "../src/particles"; // Adjust the path as necessary

jest.mock("../src/particles"); // Automatically uses the manual mock

describe("Codenamize Module", () => {
  describe("codenamize function", () => {
    it("should generate a codename with default options", () => {
      const result = codenamize("test-seed");
      expect(result).toMatch(/^(quick|lazy|happy|sad)-(fox|dog|cat|mouse)$/); // Check if it matches the expected format
    });

    it("should generate a codename with default options and a number seed", () => {
      const result = codenamize(12345);
      expect(result).toMatch(/^(quick|lazy|happy|sad)-(fox|dog|cat|mouse)$/); // Check if it matches the expected format
    });

    it("should generate a codename with default options and an object seed", () => {
      const result = codenamize({ seed: { test: "seed" } });
      expect(result).toMatch(/^(quick|lazy|happy|sad)-(fox|dog|cat|mouse)$/); // Check if it matches the expected format
    });

    it("should generate a codename with capitalized words", () => {
      const result = codenamize({ seed: "test-seed", capitalize: true });
      expect(result).toMatch(/^(Quick|Lazy|Happy|Sad)-(Fox|Dog|Cat|Mouse)$/); // Check if it matches the expected format with capitalization
    });

    it("should generate a codename with a custom separator", () => {
      const result = codenamize({ seed: "test-seed", separator: "_" });
      expect(result).toMatch(/^(quick|lazy|happy|sad)_(fox|dog|cat|mouse)$/); // Check if it matches the expected format with custom separator
    });

    it("should handle unknown particles gracefully", () => {
      const result = codenamize({ particles: ["unknown"], seed: "test-seed" });
      expect(result).toBe("unknown"); // Expect it to return 'unknown'
    });

    it("should respect the maxItemChars option", () => {
      const result = codenamize({ seed: "test-seed", maxItemChars: 4 });
      expect(result).toMatch(/^(lazy|sad)-(fox|dog|cat)$/); // Should still match the expected format
    });

    it("should allow for custom particle arrangement", () => {
      const result = codenamize({
        particles: ["adjective", "noun", "adjective"],
        seed: "test-seed",
      });
      expect(result).toMatch(
        /^(quick|lazy|happy|sad)-(fox|dog|cat|mouse)-(quick|lazy|happy|sad)$/
      ); // Check if it matches the expected format with custom particle arrangement
    });

    it("should handle empty seed gracefully and treat it as an empty string", () => {
      const result = codenamize({});
      expect(result).toMatch(/^(quick|lazy|happy|sad)-(fox|dog|cat|mouse)$/); // Check if it matches the expected format with custom separator
    });
  });

  describe("codenamize.use function", () => {
    it("should allow custom particles to be used", () => {
      const customParticles = {
        attribute: ["bright", "dark"],
        celestialBody: ["star", "moon"],
      };

      codenamize.use(customParticles); // Use custom particles
      const result = codenamize({
        seed: "custom-seed",
        particles: ["attribute", "celestialBody"],
      });
      expect(result).toMatch(/^(bright|dark)-(star|moon)$/); // Check if it matches the expected format with custom particles
    });

    it("should override existing particles with custom particles", () => {
      const customParticles = {
        adjective: ["fast", "slow"],
        noun: ["car", "bike"],
      };

      codenamize.use(customParticles); // Use custom particles
      const result = codenamize({ seed: "override-seed" });
      expect(result).toMatch(/^(fast|slow)-(car|bike)$/); // Check if it matches the expected format with overridden particles
    });
  });
});

describe("Particles Module", () => {
  it("should import adjectives from JSON correctly", () => {
    expect(adjectives).toBeDefined();
    expect(Array.isArray(adjectives)).toBe(true); // Check if adjectives is an array
    expect(adjectives.length).toBeGreaterThan(0); // Ensure the array is not empty
  });

  it("should import nouns from JSON correctly", () => {
    expect(nouns).toBeDefined();
    expect(Array.isArray(nouns)).toBe(true); // Check if nouns is an array
    expect(nouns.length).toBeGreaterThan(0); // Ensure the array is not empty
  });

  it("should store adjectives and nouns in the particles object", () => {
    expect(particles).toHaveProperty("adjective", adjectives);
    expect(particles).toHaveProperty("noun", nouns);
  });
});
