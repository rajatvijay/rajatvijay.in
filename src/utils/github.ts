const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;

interface ContributionDay {
  contributionCount: number;
  contributionLevel: string;
  date: string;
  weekday: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 3,
};

export interface ContributionData {
  totalContributions: number;
  weeks: { levels: number[] }[];
}

export interface GitHubData {
  contributions: ContributionData;
}

async function fetchGitHub(query: string) {
  const token = GITHUB_TOKEN;
  if (!token) {
    console.warn('[github] No GITHUB_TOKEN found, using fallback data');
    return null;
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      console.warn(`[github] API returned ${res.status}, using fallback data`);
      return null;
    }

    const data = await res.json();
    if (data?.errors) {
      console.warn('[github] GraphQL errors:', data.errors);
    }
    return data;
  } catch (err) {
    console.warn('[github] Fetch failed, using fallback data:', err);
    return null;
  }
}

export async function getGitHubData(): Promise<GitHubData> {
  const data = await fetchGitHub(`{
    viewer {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }`);

  if (!data?.data?.viewer) {
    return fallbackData();
  }

  const calendar = data.data.viewer.contributionsCollection.contributionCalendar;

  const weeks = calendar.weeks.map((w: ContributionWeek) => ({
    levels: w.contributionDays.map((d: ContributionDay) => LEVEL_MAP[d.contributionLevel] ?? 0),
  }));

  return {
    contributions: { totalContributions: calendar.totalContributions, weeks },
  };
}

function fallbackData(): GitHubData {
  function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  const weeks = Array.from({ length: 52 }, (_, i) => ({
    levels: Array.from({ length: 7 }, (_, j) => {
      const v = seededRandom(i * 7 + j + 42);
      return v > 0.7 ? 3 : v > 0.4 ? 2 : v > 0.15 ? 1 : 0;
    }),
  }));

  return {
    contributions: { totalContributions: 0, weeks },
  };
}
