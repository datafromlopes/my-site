---
title: "TF-IDF - An approach to determine the relevance of word in a corpus."
author: "Diego Lopes"
date: 2025-10-04
tags: [ "Statistics", "Computational Linguistics", "NLP"]
summary: "teste"
---

---

In the context of text processing, we sometimes need to determine the relevance of a term, a specific word, within a corpus.
It is helpful in many different scenarios, like text-data augmentation that use this metric to determine how to process the 
data.

More deeply in text-data augmentation, we have approaches to generate new sentences from another by deleting, swapping, 
or inserting a word. But how to decide which word to consider in these process? How important is a word in a sentence? 
Because of questions like that, nowadays we use the TF-IDF metric, proposed by Sparck Jones (1972), that is used to 
determine the relevance of a word.

