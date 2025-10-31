export const levenshtein = (a: string, b: string): number => {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : Math.min(dp[i - 1][j - 1] + 1, dp[i][j - 1] + 1, dp[i - 1][j] + 1);
    }
  }
  return dp[m][n];
};

export const fuzzyMatch = (candidate?: string, query?: string): boolean => {
  const lowerCandidate = (candidate || '').toLowerCase();
  const lowerQuery = (query || '').toLowerCase();
  if (!lowerQuery) return true;
  if (lowerCandidate.includes(lowerQuery)) return true;
  const candidateWords = lowerCandidate.split(/\s+/).filter(Boolean);
  const queryWords = lowerQuery.split(/\s+/).filter(Boolean);
  return queryWords.every(qw =>
    candidateWords.some(cw => {
      const distance = levenshtein(cw, qw);
      const threshold = Math.max(1, Math.floor(qw.length / 3));
      return distance <= threshold;
    })
  );
};
