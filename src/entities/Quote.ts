export class Quote {
  private content: string;
  private author: string;
  private authorSlug: string;
  private length: number;
  private tags: string[];

  constructor(
    content: string,
    author: string,
    authorSlug: string,
    length: number,
    tags: string[]
  ) {
    this.content = content;
    this.author = author;
    this.authorSlug = authorSlug;
    this.length = length;
    this.tags = tags;
  }

  /**
   * Getter $content
   * @return {string}
   */
  public get $content(): string {
    return this.content;
  }

  /**
   * Getter $author
   * @return {string}
   */
  public get $author(): string {
    return this.author;
  }

  /**
   * Getter $authorSlug
   * @return {string}
   */
  public get $authorSlug(): string {
    return this.authorSlug;
  }

  /**
   * Getter $length
   * @return {number}
   */
  public get $length(): number {
    return this.length;
  }

  /**
   * Getter $tags
   * @return {string[]}
   */
  public get $tags(): string[] {
    return this.tags;
  }

  /**
   * Setter $content
   * @param {string} value
   */
  public set $content(value: string) {
    this.content = value;
  }

  /**
   * Setter $author
   * @param {string} value
   */
  public set $author(value: string) {
    this.author = value;
  }

  /**
   * Setter $authorSlug
   * @param {string} value
   */
  public set $authorSlug(value: string) {
    this.authorSlug = value;
  }

  /**
   * Setter $length
   * @param {number} value
   */
  public set $length(value: number) {
    this.length = value;
  }

  /**
   * Setter $tags
   * @param {string[]} value
   */
  public set $tags(value: string[]) {
    this.tags = value;
  }
}
