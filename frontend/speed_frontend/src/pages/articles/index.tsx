import { GetStaticProps, NextPage } from "next";
import SortableTable from "../../components/table/SortableTable";

interface ArticlesInterface {
    id: string;
    title: string;
    author: string;
    journal_name: string;
    publication_date: Date;
    doi: string;
    summary_brief: string;
    status: string;
}

type ArticlesProps = { articles: ArticlesInterface[] };

const Articles: NextPage<ArticlesProps> = ({ articles }) => {
    const headers: { key: keyof ArticlesInterface; label: string }[] = [
        { key: "title", label: "Title" },
        { key: "author", label: "Author" },
        { key: "journal_name", label: "Journal Name" },
        { key: "publication_date", label: "Publication Date" },
        { key: "doi", label: "DOI" },
        { key: "summary_brief", label: "Summary" },
    ];

    const approved_articles: ArticlesInterface[] = articles.filter(
        (article) => article.status === "approved");

    return (
        <div className="container">
        <h1>Articles Index Page</h1>
        <p>Page containing a table of articles:</p>

        {approved_articles.length === 0 ? (
            <p>No approved articles found.</p>
        ) : (
            <SortableTable headers={headers} data={approved_articles} />
        )}
        </div>
    );
};

export const getStaticProps: GetStaticProps<ArticlesProps> = async (_) => {
// Map the data to ensure all articles have consistent property names

    //Database
    let _data = await fetch("http://localhost:8082/api/articles");
    const _post = await _data.json();

    {_post.map((post: any) => (
        console.log(post)
    ))}

    const articles = _post.map((article: any) => ({
    id: article.id ?? article._id,
    title: article.title,
    author: article.author,
    journal_name: article.journal_name,
    publication_date: article.publication_date,
    doi: article.doi,
    summary_brief: article.summary_brief,
    status: article.status,
    }));


    return {
        props: { articles },
    };
};

export default Articles