import { formatTimestampDate } from "../helpers/Date";

describe("FormatTimestampDate function", () => {
  it("formats a timestamp for 3 mars 2021", () => {
    const timestamp = "2021-03-03T00:00:00.000Z";
    const formattedDate = formatTimestampDate(timestamp);
    expect(formattedDate).toBe("03/03/2021");
  });

  it("formats a timestamp for 31 décembre 2025", () => {
    const timestamp = "2025-12-31T00:00:00.000Z";
    const formattedDate = formatTimestampDate(timestamp);
    expect(formattedDate).toBe("31/12/2025");
  });
});
