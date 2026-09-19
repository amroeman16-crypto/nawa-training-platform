import { describe, expect, it } from "vitest";
import { courses } from "../client/src/pages/Home";

describe("training content", () => {
  it("exposes a complete set of featured courses", () => {
    expect(courses).toHaveLength(3);
    expect(courses.map((course) => course.title)).toEqual([
      "القيادة الرقمية وصناعة الأثر",
      "أساسيات تجربة المستخدم UX",
      "الذكاء الاصطناعي للعمل الذكي",
    ]);
    expect(courses.every((course) => course.duration && course.lessons > 0 && course.rating)).toBe(true);
  });
});
