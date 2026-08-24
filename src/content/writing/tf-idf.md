---
title: 'TF-IDF: measuring what a word is worth in a corpus'
date: 2026-05-25
updated: 2026-05-25
featured: true
cover: /media/writing/tfidf-wallpaper.png
tldr: Term frequency tells you how often a word appears. Inverse document frequency tells you whether that means anything. Here is the maths, worked end to end on a corpus small enough to check by hand.
tags:
  - computational linguistics
  - NLP
  - information retrieval
---

In text processing we often need to decide how much a particular term matters inside a corpus.
The question shows up everywhere — ranking search results, selecting features, and in text data
augmentation, where methods generate new sentences by deleting, swapping or inserting a word.

That last case makes the problem concrete. If you are going to swap a word, *which* word should
you pick? Swapping "the" produces nothing; swapping the one domain-specific noun in the sentence
changes its meaning entirely. You need a score for how much a word is carrying.

The standard answer is TF-IDF, proposed by Spärck Jones in 1972, and it is still the right first
thing to reach for.

## The intuition

TF-IDF stands for **Term Frequency – Inverse Document Frequency**. The idea is small and
effective: a word's importance rises with how often it appears in a document, and falls with how
often it appears in *every* document.

Consider "the". Its term frequency in any English document is high. Its value in telling that
document apart from another is zero, because it appears in all of them. The IDF term is what
encodes that penalty, pushing weight away from ubiquitous words and towards the rarer,
domain-specific ones that actually characterise a document.

## Formal definition

The TF-IDF score for a term $t$ in a document $d$, given a corpus $D$, is the product of two
metrics:

$$
TF\text{-}IDF(t, d, D) = TF(t, d) \times IDF(t, D)
$$

### Term frequency

Term frequency measures how often a term occurs in a document. Since documents vary in length, the
raw count is normalised by the document's total word count:

$$
TF(t, d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}
$$

where $f_{t,d}$ is the raw count of term $t$ in document $d$, and the denominator is the total
number of terms in $d$.

### Inverse document frequency

IDF measures the informational value of a word across the whole corpus — scaling down terms that
occur everywhere and scaling up terms that occur rarely:

$$
IDF(t, D) = \log \left( \frac{N}{|\{d \in D : t \in d\}|} \right)
$$

where $N$ is the total number of documents and the denominator counts the documents containing
$t$. A term absent from the corpus makes that denominator zero, which is why practical
implementations — `TfidfVectorizer` in scikit-learn among them — add a constant $+1$ to it.

## Worked example

Take a corpus of two documents, small enough to verify by hand:

- **Document A:** "machine learning is fun"
- **Document B:** "learning is awesome"

### Step 1 — term frequency

Document A has four words, Document B has three.

| Term | TF in A | TF in B |
| --- | --- | --- |
| machine | $1/4 = 0.25$ | $0$ |
| learning | $1/4 = 0.25$ | $1/3 \approx 0.33$ |
| is | $1/4 = 0.25$ | $1/3 \approx 0.33$ |
| fun | $1/4 = 0.25$ | $0$ |
| awesome | $0$ | $1/3 \approx 0.33$ |

### Step 2 — inverse document frequency

With $N = 2$, using base-10 logarithms:

- **machine, fun, awesome** each appear in one document: $IDF = \log_{10}(2/1) \approx 0.301$
- **learning, is** each appear in both: $IDF = \log_{10}(2/2) = 0$

### Step 3 — the matrix

Multiplying $TF \times IDF$ per term, per document:

| Term | TF-IDF (Doc A) | TF-IDF (Doc B) |
| --- | --- | --- |
| machine | $0.25 \times 0.301 = 0.075$ | $0$ |
| learning | $0$ | $0$ |
| is | $0$ | $0$ |
| fun | $0.25 \times 0.301 = 0.075$ | $0$ |
| awesome | $0$ | $0.33 \times 0.301 \approx 0.100$ |

**Reading the result.** "learning" and "is" score exactly zero. They appear in every document in
this corpus, so they carry no power to distinguish A from B — which is precisely what IDF is built
to express. "machine", "fun" and "awesome" survive as the terms that characterise their documents.

The zeros are worth sitting with. In a two-document corpus, any term appearing in both is
annihilated. On a realistic corpus the effect is softer, but the direction is the same: TF-IDF is
a measure of *distinctiveness*, not of frequency.

## Where it breaks down

TF-IDF treats terms as independent symbols. "car" and "automobile" are as unrelated to it as "car"
and "carburettor" — which is why dense embeddings replaced it for tasks that need semantic
similarity. What TF-IDF retains is interpretability: every number in the matrix can be traced back
to two counts, and when a retrieval system misbehaves, that traceability is worth a great deal.

## References

1. **Spärck Jones, K. (1972).** *A statistical interpretation of term specificity and its application in retrieval.* Journal of Documentation, 28(1), 11–21.
2. **Salton, G., & McGill, M. J. (1983).** *Introduction to Modern Information Retrieval.* McGraw-Hill.
3. **Ramos, J. (2003).** *Using TF-IDF to Determine Word Relevance in Document Queries.* Proceedings of the First Instructional Conference on Machine Learning.
4. **Manning, C. D., Raghavan, P., & Schütze, H. (2008).** *Introduction to Information Retrieval.* Cambridge University Press.
