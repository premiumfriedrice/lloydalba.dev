export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export async function fetchContributions(
  username: string
): Promise<ContributionWeek[]> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const contributions: { date: string; count: number; level: number }[] =
      data.contributions || [];

    // Group into weeks (7-day chunks, Sun-Sat)
    const weeks: ContributionWeek[] = [];
    let currentWeek: ContributionDay[] = [];

    for (const day of contributions) {
      const dayOfWeek = new Date(day.date).getDay();
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push({ days: currentWeek });
        currentWeek = [];
      }
      currentWeek.push({
        date: day.date,
        count: day.count,
        level: day.level,
      });
    }
    if (currentWeek.length > 0) {
      weeks.push({ days: currentWeek });
    }

    return weeks;
  } catch {
    return [];
  }
}
