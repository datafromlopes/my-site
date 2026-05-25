---
title: "TF-IDF - An approach to determine the relevance of word in a corpus."
author: "Diego Lopes"
date: 2026-05-25
tags: [ "Statistics", "Computational Linguistics", "NLP"]
summary: "How to create and interpret the TF-IDF matrix."
---

In the context of text processing, we sometimes need to determine the relevance of a term, a specific word, within a corpus.
It is helpful in many different scenarios, like text-data augmentation that use this metric to determine how to process the 
data.

More deeply in text-data augmentation, we have approaches to generate new sentences from another by deleting, swapping, 
or inserting a word. But how to decide which word to consider in these process? How important is a word in a sentence? 
Because of questions like that, nowadays we use the TF-IDF metric, proposed by Sparck Jones (1972), that is used to 
determine the relevance of a word.

---

## The Intuition Behind TF-IDF

TF-IDF stands for **Term Frequency - Inverse Document Frequency**. The core idea is simple but highly effective: a word's importance increases proportionally to the number of times it appears in a specific document (Term Frequency), but is offset by the frequency of the word in the entire corpus (Inverse Document Frequency).

For instance, the word "the" might appear dozens of times in a document, giving it a high Term Frequency. However, because it appears in almost *every* document in the English language, it carries very little semantic weight. The Inverse Document Frequency component penalizes these common words, highlighting the rarer, more domain-specific terms that truly define a document's subject.

## Formal Definition and Formulas

The TF-IDF score for a given term $t$ in a specific document $d$, given a corpus $D$, is calculated by multiplying two distinct metrics:

$$TF\text{-}IDF(t, d, D) = TF(t, d) \times IDF(t, D)$$

### 1. Term Frequency (TF)
Term frequency measures how frequently a term occurs in a document. Because documents can vary greatly in length, it is standard practice to normalize the raw count by dividing it by the total number of words in that document.

$$TF(t, d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}$$

Where:
* $f_{t,d}$ is the raw count of term $t$ in document $d$.
* The denominator represents the total number of terms in document $d$.

### 2. Inverse Document Frequency (IDF)
IDF measures the informational value of the word across the entire corpus. It scales down the weight of terms that occur very frequently and scales up the weight of rare terms.

$$IDF(t, D) = \log \left( \frac{N}{|\{d \in D : t \in d\}|} \right)$$

Where:
* $N$ is the total number of documents in the corpus $D$.
* $|\{d \in D : t \in d\}|$ is the number of documents where the term $t$ appears. If the term is not in the corpus, this can lead to a division-by-zero, which is why a constant $+1$ is often added to the denominator in practical implementations (like Scikit-Learn's `TfidfVectorizer`).

---

## A Practical Example

Let's build a TF-IDF matrix to see this in action. Consider a tiny corpus of two documents:

* **Document A:** "machine learning is fun"
* **Document B:** "learning is awesome"

### Step 1: Calculate TF
First, we calculate the Term Frequency for each word in Document A (which has 4 words total) and Document B (which has 3 words total).

| Term | TF in Doc A | TF in Doc B |
| :--- | :--- | :--- |
| machine | $1/4 = 0.25$ | $0$ |
| learning | $1/4 = 0.25$ | $1/3 \approx 0.33$ |
| is | $1/4 = 0.25$ | $1/3 \approx 0.33$ |
| fun | $1/4 = 0.25$ | $0$ |
| awesome | $0$ | $1/3 \approx 0.33$ |

### Step 2: Calculate IDF
Our total number of documents $N = 2$. Let's use the base-10 logarithm for this example.

* **"machine", "fun", "awesome"**: Each appears in only 1 document.
  $$IDF = \log_{10}(2 / 1) \approx 0.301$$
* **"learning", "is"**: Each appears in 2 documents.
  $$IDF = \log_{10}(2 / 2) = \log_{10}(1) = 0$$

### Step 3: Calculate the Final TF-IDF Matrix
Now, we multiply $TF \times IDF$ for each term per document.

| Term | TF-IDF (Doc A) | TF-IDF (Doc B) |
| :--- | :--- | :--- |
| machine | $0.25 \times 0.301 = 0.075$ | $0 \times 0.301 = 0$ |
| learning | $0.25 \times 0 = 0$ | $0.33 \times 0 = 0$ |
| is | $0.25 \times 0 = 0$ | $0.33 \times 0 = 0$ |
| fun | $0.25 \times 0.301 = 0.075$ | $0 \times 0.301 = 0$ |
| awesome | $0 \times 0.301 = 0$ | $0.33 \times 0.301 \approx 0.1$ |

**Interpretation:** The words "learning" and "is" scored a $0$. Since they appear in every document in our small corpus, they provide no unique identifying value to differentiate Document A from Document B. Meanwhile, "machine", "fun", and "awesome" emerge as the most relevant keywords.

---

## Scientific References & Further Reading

The theoretical foundation for term weighting and its evolution into the TF-IDF framework we use today is heavily documented in the field of Information Retrieval. For those looking to dive deeper into the mathematics and history, I recommend exploring these seminal papers:

1. **Sparck Jones, K. (1972).** *A statistical interpretation of term specificity and its application in retrieval.* Journal of Documentation, 28(1), 11-21. (This is the original paper introducing the concept of IDF).
2. **Salton, G., & McGill, M. J. (1983).** *Introduction to Modern Information Retrieval.* McGraw-Hill. (This book is fundamental for establishing the Vector Space Model where TF-IDF is heavily utilized).
3. **Ramos, J. (2003).** *Using TF-IDF to Determine Word Relevance in Document Queries.* Proceedings of the First Instructional Conference on Machine Learning. (A great, accessible paper on practical applications of TF-IDF).
4. **Manning, C. D., Raghavan, P., & Schütze, H. (2008).** *Introduction to Information Retrieval.* Cambridge University Press. (A modern standard text covering the nuances of TF-IDF weighting variations).