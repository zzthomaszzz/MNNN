import { FormEvent, useState } from "react";
import * as bibtexParse from "bibtex-parse-js";
import formStyles from "../../styles/Form.module.scss";

const NewDiscussion = () => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [pubYear, setPubYear] = useState<number>(0);
  const [doi, setDoi] = useState("");
  const [summary, setSummary] = useState("");
  const [linkedDiscussion, setLinkedDiscussion] = useState("");

  // Handle BibTeX file upload
  const handleBibUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = bibtexParse.toJSON(text);

    if (parsed.length > 0) {
      const entry = parsed[0].entryTags;

      setTitle(entry.title?.replace(/[{}]/g, "") || "");
      setAuthors(
        entry.author ? entry.author.split(" and ").map((a) => a.trim()) : []
      );
      setSource(entry.journal || entry.booktitle || "");
      setPubYear(Number(entry.year) || 0);
      setDoi(entry.doi || "");
    }
  };

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const payload = {
    entryType: "article", 
    citationKey: title.toLowerCase().replace(/\s+/g, "_"), 
    entryTags: {
      title,
      author: authors.join(" and "),
      journal: source,
      year: pubYear.toString(),
      doi,
      abstract: summary,
      linked_discussion: linkedDiscussion,
    },
  };

  try {
    const res = await fetch("http://localhost:3001/bibtex", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([payload]), 
    });

    if (res.ok) {
      alert("Upload successful!");
    } else {
      const error = await res.json();
      console.error("Upload failed:", error);
      alert("Upload failed.");
    }
  } catch (error) {
    console.error("Request error:", error);
    alert("Server error.");
  }
};

  // Some helper methods for the authors array
  const addAuthor = () => {
    setAuthors(authors.concat([""]));
  };
  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };
  const changeAuthor = (index: number, value: string) => {
    setAuthors(
      authors.map((oldValue, i) => {
        return index === i ? value : oldValue;
      })
    );
  };

  // Return the full form
  return (
    <div className="container">
      <h1>New Article</h1>

      <div className="mb-4">
        <label>Upload BibTeX File:</label>
        <input
          type="file"
          accept=".bib"
          onChange={handleBibUpload}
          className={formStyles.formItem}
        />
      </div>

      <form className={formStyles.form} onSubmit={submitNewArticle}>
        <label htmlFor="title">Title:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />

        <label htmlFor="author">Authors:</label>
        {authors.map((author, index) => {
          return (
            <div key={`author ${index}`} className={formStyles.arrayItem}>
              <input
                type="text"
                name="author"
                value={author}
                onChange={(event) => changeAuthor(index, event.target.value)}
                className={formStyles.formItem}
              />

              <button
                onClick={() => removeAuthor(index)}
                className={formStyles.buttonItem}
                style={{ marginLeft: "3rem" }}
                type="button"
              >
                -
              </button>
            </div>
          );
        })}

        <button
          onClick={() => addAuthor()}
          className={formStyles.buttonItem}
          style={{ marginLeft: "auto" }}
          type="button"
        >
          +
        </button>

        <label htmlFor="source">
          Journal Name (volume, issue, page number):
        </label>
        <input
          className={formStyles.formItem}
          type="text"
          name="source"
          id="source"
          value={source}
          onChange={(event) => {
            setSource(event.target.value);
          }}
        />
        <label htmlFor="pubYear">Publication Year:</label>
        <input
          className={formStyles.formItem}
          type="number"
          name="pubYear"
          id="pubYear"
          value={pubYear}
          onChange={(event) => {
            const val = event.target.value;
            if (val === "") {
              setPubYear(0);
            } else {
              setPubYear(parseInt(val));
            }
          }}
        />
        <label htmlFor="doi">DOI:</label>
        <input
          className={formStyles.formItem}
          type="text"
          name="doi"
          id="doi"
          value={doi}
          onChange={(event) => {
            setDoi(event.target.value);
          }}
        />
        <label htmlFor="summary">Summary:</label>
        <textarea
          className={formStyles.formTextArea}
          name="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
        <button className={formStyles.formItem} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
export default NewDiscussion;
