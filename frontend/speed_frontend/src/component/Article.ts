
export type Article = {
    _id?: string;

    title?: string;
    author?: string;
    journal_name?: string;
    publication_date?: Date;
    volume?: string;
    number?: string;
    pages?: string;
    doi?: string;

    submission_date?: Date;
    summary_brief?: string;
};

export const DefaultEmptyArticle: Article = {
    _id: undefined,
    title: "Testing",
    author: "Hi",
    journal_name: "abc",
    publication_date: undefined,
    volume: "5",
    number: "15",
    pages: "52",
    doi: "1230895",

    submission_date: undefined,
    summary_brief: "Maybe",
}