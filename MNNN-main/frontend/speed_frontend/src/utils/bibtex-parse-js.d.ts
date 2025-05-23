declare module "bibtex-parse-js" {
  export function toJSON(bibtex: string): {
    citationKey: string;
    entryType: string;
    entryTags: Record<string, string>;
  }[];
}