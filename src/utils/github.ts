const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = 'rajatvijay';

interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: { levels: number[] }[];
}

export interface RecentCommit {
  repo: string;
  message: string;
  date: string;
  additions: number;
  deletions: number;
}

export interface GitHubData {
  contributions: ContributionData;
  recentCommits: RecentCommit[];
  fetchedAt: string;
}

function contributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  return 3;
}

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

async function fetchGitHub(query: string) {
  const token = GITHUB_TOKEN;
  if (!token) {
    console.warn('[github] No GITHUB_TOKEN found, using fallback data');
    return null;
  }

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

  return res.json();
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
              date
              weekday
            }
          }
        }
      }
      repositories(first: 10, orderBy: {field: PUSHED_AT, direction: DESC}, privacy: PUBLIC) {
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 3) {
                  nodes {
                    messageHeadline
                    committedDate
                    additions
                    deletions
                  }
                }
              }
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
  const repos = data.data.viewer.repositories.nodes;

  const weeks = calendar.weeks.map((w: ContributionWeek) => ({
    levels: w.contributionDays.map((d: ContributionDay) => contributionLevel(d.contributionCount)),
  }));

  const recentCommits: RecentCommit[] = [];
  for (const repo of repos) {
    const ref = repo.defaultBranchRef;
    if (!ref?.target?.history?.nodes) continue;
    for (const commit of ref.target.history.nodes) {
      recentCommits.push({
        repo: repo.name,
        message: commit.messageHeadline,
        date: relativeTime(commit.committedDate),
        additions: commit.additions,
        deletions: commit.deletions,
      });
    }
  }

  recentCommits.sort((a, b) => {
    const order = ['just now', 'h ago', 'd ago', 'mo ago'];
    const aIdx = order.findIndex(s => a.date.includes(s) || a.date === s);
    const bIdx = order.findIndex(s => b.date.includes(s) || b.date === s);
    return aIdx - bIdx;
  });

  return {
    contributions: {
      totalContributions: calendar.totalContributions,
      weeks,
    },
    recentCommits: recentCommits.slice(0, 5),
    fetchedAt: new Date().toISOString(),
  };
}

function fallbackData(): GitHubData {
  // Seeded deterministic fallback when no token is available
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
    recentCommits: [
      { repo: 'collaborative-plan-tool', message: 'Prepare for open source release', date: '2d ago', additions: 45, deletions: 12 },
      { repo: 'mind', message: 'Add iOS Shortcut import link', date: '5d ago', additions: 23, deletions: 3 },
      { repo: 'chat-notes', message: 'Update service worker cache', date: '1mo ago', additions: 18, deletions: 8 },
    ],
    fetchedAt: new Date().toISOString(),
  };
}
