# Retrieval Metrics Mini Project

This project compares keyword search and semantic search using Mean Reciprocal Rank (MRR) and Recall@10. The supplied ranked results and test queries are used as fixtures, so no database or API keys are needed.

## Run

```bash
node eval.js
```

## Results

```text
| Query | Keyword rank | Semantic rank |
|---|---|---|
| my redis cache keeps showing old data | 8 | 1 |
| how do I add semantic search to a table I already have | miss | 2 |
| redis or memcached for caching | 1 | 2 |
| why did my query get slower after I added an index | miss | 1 |
| what does ACID actually guarantee | 2 | 1 |
| how do I keep my postgres online while changing the schema | 6 | 3 |
| my background jobs stop after every deploy | miss | 2 |
| how do I let my database accept more writes per second | 4 | 1 |
| sql or nosql for a new product | 1 | 3 |
| why does my redis memory keep climbing | miss | 2 |
| **Summary** | **MRR 0.30 · Recall@10 0.60** | **MRR 0.67 · Recall@10 1.00** |
```

## Interpretation

Semantic search performs better overall: its MRR is 0.67 compared with keyword search's 0.30, and its Recall@10 is 1.00 versus 0.60, meaning it retrieves a relevant result for every query and tends to rank it higher. Keyword search wins on “redis or memcached for caching” and “sql or nosql for a new product,” which contain explicit product or technology names that exact term matching can capture well. Semantic search wins on the remaining queries, which often describe a problem or intent in conversational language rather than using the precise wording of a relevant post. The semantic system also finds relevant results for all four queries keyword search misses. A team may still retain keyword search because exact terms and named technologies can make it especially effective for particular queries, complementing semantic retrieval.
