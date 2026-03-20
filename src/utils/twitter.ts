const TWITTER_BEARER = import.meta.env.TWITTER_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN;
const TWITTER_USERNAME = 'rajatvijay';

export interface Tweet {
  id: string;
  text: string;
  date: string;
  likes: number;
  retweets: number;
  url: string;
  pinned?: boolean;
}

export interface TwitterData {
  handle: string;
  profileUrl: string;
  pinned: Tweet | null;
  recent: Tweet[];
  live: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function fetchTwitterAPI(endpoint: string): Promise<any> {
  if (!TWITTER_BEARER) return null;

  const res = await fetch(`https://api.twitter.com/2${endpoint}`, {
    headers: { Authorization: `Bearer ${TWITTER_BEARER}` },
  });

  if (!res.ok) {
    console.warn(`[twitter] API returned ${res.status}`);
    return null;
  }

  return res.json();
}

export async function getTwitterData(): Promise<TwitterData | null> {
  const profileUrl = `https://x.com/${TWITTER_USERNAME}`;
  const handle = `@${TWITTER_USERNAME}`;

  if (!TWITTER_BEARER) {
    console.warn('[twitter] No TWITTER_BEARER_TOKEN found, skipping X feed');
    return null;
  }

  try {
    // Get user ID
    const userRes = await fetchTwitterAPI(
      `/users/by/username/${TWITTER_USERNAME}?user.fields=pinned_tweet_id`
    );
    if (!userRes?.data) return null;

    const userId = userRes.data.id;
    const pinnedId = userRes.data.pinned_tweet_id;

    // Get recent tweets
    const tweetsRes = await fetchTwitterAPI(
      `/users/${userId}/tweets?max_results=5&tweet.fields=created_at,public_metrics&exclude=replies,retweets`
    );
    if (!tweetsRes?.data) return null;

    const allTweets: Tweet[] = tweetsRes.data.map((t: any) => ({
      id: t.id,
      text: t.text,
      date: formatDate(t.created_at),
      likes: t.public_metrics?.like_count || 0,
      retweets: t.public_metrics?.retweet_count || 0,
      url: `https://x.com/${TWITTER_USERNAME}/status/${t.id}`,
      pinned: t.id === pinnedId,
    }));

    const pinned = allTweets.find(t => t.pinned) || null;
    const recent = allTweets.filter(t => !t.pinned).slice(0, 2);

    return { handle, profileUrl, pinned, recent, live: true };
  } catch (err) {
    console.warn('[twitter] Failed to fetch:', err);
    return null;
  }
}

