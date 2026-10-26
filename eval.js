// Evaluate keyword and semantic retrieval using MRR and Recall@10.
const fs = require('fs');

// Load test-set.csv (query,correct_post_ids). Correct IDs may be semicolon-separated.
function loadTestSet(path) {
  const lines = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/).slice(1);
  return lines.map(line => {
    const [query, ids] = line.split(',');
    return { query, correctIds: ids.split(';').map(Number) };
  });
}
const testSet = loadTestSet('test-set.csv');
const results = JSON.parse(fs.readFileSync('search-results.json', 'utf8'));

// Return reciprocal rank for the first relevant result (rank is 1-based).
function reciprocalRank(rankedIds, correctIds) {
  const rank = rankOf(rankedIds, correctIds);
  return rank === null ? 0 : 1 / rank;
}

// Return the 1-based rank of the first relevant result, or null for a miss.
function rankOf(rankedIds, correctIds) {
  const correct = new Set(correctIds);
  const index = rankedIds.findIndex(id => correct.has(id));
  return index === -1 ? null : index + 1;
}

// Evaluate both systems for every query.
let keywordRRTotal = 0;
let semanticRRTotal = 0;
let keywordHits = 0;
let semanticHits = 0;

const rows = testSet.map(({ query, correctIds }) => {
  const keywordIds = results[query]?.keyword ?? [];
  const semanticIds = results[query]?.semantic ?? [];

  const keywordRank = rankOf(keywordIds, correctIds);
  const semanticRank = rankOf(semanticIds, correctIds);
  const keywordRR = reciprocalRank(keywordIds, correctIds);
  const semanticRR = reciprocalRank(semanticIds, correctIds);

  keywordRRTotal += keywordRR;
  semanticRRTotal += semanticRR;
  if (keywordRR > 0) keywordHits += 1;
  if (semanticRR > 0) semanticHits += 1;

  return { query, keywordRank, semanticRank };
});

const totalQueries = testSet.length;
const keywordMRR = keywordRRTotal / totalQueries;
const semanticMRR = semanticRRTotal / totalQueries;
const keywordRecall = keywordHits / totalQueries;
const semanticRecall = semanticHits / totalQueries;

console.log('| Query | Keyword rank | Semantic rank |');
console.log('|---|---|---|');
for (const row of rows) {
  console.log(`| ${row.query} | ${row.keywordRank ?? 'miss'} | ${row.semanticRank ?? 'miss'} |`);
}
console.log(
  `| **Summary** | **MRR ${keywordMRR.toFixed(2)} · Recall@10 ${keywordRecall.toFixed(2)}** | **MRR ${semanticMRR.toFixed(2)} · Recall@10 ${semanticRecall.toFixed(2)}** |`
);
