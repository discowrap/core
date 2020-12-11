export abstract class SearchResults {
  protected readonly _responseBody;

  protected constructor(responseBody: object) {
    this._responseBody = responseBody;
  }

  abstract extractIds(): string[];

  abstract extractSearchHits(): object[];

  abstract extractTotal(): number;

  abstract getHitId(hit: object): string;

  abstract getHitScore(hit: object): number;

  ids(): string[] {
    return this.extractIds();
  }

  hits(): object[] {
    return this.extractSearchHits();
  }

  total(): number {
    return this.extractTotal();
  }

  matchUnordered(ids: string[]): boolean {
    return areEqual(ids, this.extractIds(), true)
  }

  matchOrdered(ids: string[]): boolean {
    return areEqual(ids, this.extractIds(), false)
  }

  containUnorderedSubset(ids: string[]): boolean {
    return isSubsetOf(ids, this.extractIds(), true);
  }

  containOrderedSubset(ids: string[]): boolean {
    return isSubsetOf(ids, this.extractIds(), false);
  }

  haveIdenticalScore(ids: string[]): boolean {
    if (! this.containUnorderedSubset(ids) ) {
      return false; // missing one or more of the documents
    }

    // Verify that the scores for all of the matching documents are the same.
    return this.extractSearchHits()
      .filter(h => ids.includes(this.getHitId(h)))
      .map(h => this.getHitScore(h))
      .every((val,idx,arr) => idx === 0 || val === arr[idx - 1]);
  }

  contain(id: string): boolean {
    return this.extractIds().includes(id);
  }
}

function areEqual(set1, set2, sort = true) {
  const s1 = (sort) ? set1.map(String).sort() : set1.map(String);
  const s2 = (sort) ? set2.map(String).sort() : set2.map(String);

  return arrayEquals(s1, s2);
}

function isSubsetOf(set1, set2, sort = true) {
  const s1 = (sort) ? set1.map(String).sort() : set1.map(String);
  const s2 = (sort) ? set2.map(String).filter(r => s1.includes(r)).sort() : set2.map(String).filter(r => s1.includes(r));

  return arrayEquals(s1, s2);
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}