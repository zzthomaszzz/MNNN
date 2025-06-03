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

  const [errors, setErrors] = useState({
    title: false,
    authors: false,
    source: false,
    pubYear: false,
    doi: false,
    summary: false
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Handle BibTeX file upload
  const handleBibUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if(!file.name.endsWith(".bib")){
      alert("Only .bib format files allowed");
      e.target.value = "";
      return;
    }

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
      
      // 清除所有错误状态
      setErrors({
        title: false,
        authors: false,
        source: false,
        pubYear: false,
        doi: false,
        summary: false
      });
    }
  };

  const submitNewArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newErrors = {
      title: !title.trim(),
      authors: authors.length === 0 || authors.some(a => !a.trim()),
      source: !source.trim(),
      pubYear: pubYear <= 0,
      doi: !doi.trim(),
      summary: !summary.trim()
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    const payload = {
      title,
      author: authors.join(" and "),
      journal_name: source,
      publication_date: pubYear.toString(),
      doi,
      summary_brief: summary,
    };

    try {
      const res = await fetch("http://localhost:8082/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowSuccess(true);
        setTitle("");
        setAuthors([]);
        setSource("");
        setPubYear(0);
        setDoi("");
        setSummary("");
      } else {
        const error = await res.json();
        console.error("Upload failed:", JSON.stringify(error, null, 2));
        alert("Upload failed."+(error.message || "Bad Request"));
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("Server error.");
    }
  };

  // Some helper methods for the authors array
  const addAuthor = () => {
    setAuthors(authors.concat([""]));
    setErrors({...errors, authors: false});
  };
  
  const removeAuthor = (index: number) => {
    const newAuthors = authors.filter((_, i) => i !== index);
    setAuthors(newAuthors);
    setErrors({...errors, authors: newAuthors.length === 0});
  };
  
  const changeAuthor = (index: number, value: string) => {
    setAuthors(
      authors.map((oldValue, i) => {
        return index === i ? value : oldValue;
      })
    );
    setErrors({...errors, authors: false});
  };

  // Return the full form
  return (
    <div className="container">
      <h1>New Article</h1>  
      <div className="mb-4">
        <label htmlFor="bibUpload">Upload BibTeX File:</label>
        <input
          type="file"
          id="bibUpload"
          accept=".bib"
          onChange={handleBibUpload}
          className={formStyles.formItem}
        />
      </div>

      <form className={formStyles.form} onSubmit={submitNewArticle}>
        <label htmlFor="title">Title:</label>
        <input
          className={`${formStyles.formItem} ${errors.title ? formStyles.error : ''}`}
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setErrors({...errors, title: false});
          }}
        />
        {errors.title && <p className={formStyles.errorMessage}>Please enter Title</p>}

        <label>Authors:</label>
        {authors.map((author, index) => {
          return (
            <div key={`author ${index}`} className={formStyles.arrayItem}>
              <label htmlFor={`author-${index}`}>Author {index + 1}</label>
              <input
                type="text"
                name="author"
                id={`author-${index}`}
                value={author}
                onChange={(event) => {
                  changeAuthor(index, event.target.value);
                }}
                className={`${formStyles.formItem} ${errors.authors ? formStyles.error : ''}`}
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
        {errors.authors && <p className={formStyles.errorMessage}>At least one author is required</p>}

        <button
          onClick={() => addAuthor()}
          className={formStyles.buttonItem}
          style={{ marginLeft: "auto" }}
          type="button"
        >
          +
        </button>

        <label htmlFor="source">Journal Name:</label>
        <input
          className={`${formStyles.formItem} ${errors.source ? formStyles.error : ''}`}
          type="text"
          name="source"
          id="source"
          value={source}
          onChange={(event) => {
            setSource(event.target.value);
            setErrors({...errors, source: false});
          }}
        />
        {errors.source && <p className={formStyles.errorMessage}>Journal name is required</p>}

        <label htmlFor="pubYear">Publication Year:</label>
        <input
          className={`${formStyles.formItem} ${errors.pubYear ? formStyles.error : ''}`}
          type="number"
          name="pubYear"
          id="pubYear"
          value={pubYear}
          onChange={(event) => {
            const val = event.target.value;
            setErrors({...errors, pubYear: false});
            if (val === "") {
              setPubYear(0);
            } else {
              setPubYear(parseInt(val));
            }
          }}
        />
        {errors.pubYear && <p className={formStyles.errorMessage}>Publication Year is required</p>}

        <label htmlFor="doi">DOI:</label>
        <input
          className={`${formStyles.formItem} ${errors.doi ? formStyles.error : ''}`}
          type="text"
          name="doi"
          id="doi"
          value={doi}
          onChange={(event) => {
            setDoi(event.target.value);
            setErrors({...errors, doi: false});
          }}
        />
        {errors.doi && <p className={formStyles.errorMessage}>DOI is required</p>}

        <label htmlFor="summary">Summary:</label>
        <textarea
          className={`${formStyles.formTextArea} ${errors.summary ? formStyles.error : ''}`}
          name="summary"
          value={summary}
          id="summary"
          onChange={(event) => {
            setSummary(event.target.value);
            setErrors({...errors, summary: false});
          }}
        />
        {errors.summary && <p className={formStyles.errorMessage}>Summary is required</p>}

        <button className={formStyles.submitButton} type="submit">
          Submit
        </button>
      </form>
      {showSuccess && (
      <div className={formStyles.successMessage}>
        <p>Congratulations on uploading successfully, please wait for review</p>
        <button 
          onClick={() => setShowSuccess(false)}
          className={formStyles.closeButton}
        >
          ×
        </button>
      </div>
    )}
    </div>
  );
};

export default NewDiscussion;