import React, { ChangeEvent, FormEvent, useState} from "react";
import { useRouter} from "next/navigation";
import { Article, DefaultEmptyArticle } from "@/component/Article";

const CreateArticleComponent = () => {
    const navigate = useRouter();

    const [article, setArticle] = useState<Article>(DefaultEmptyArticle);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setArticle({...article, [event.target.name]: event.target.value });    
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(article);
        fetch("http://localhost:8082/api/articles", {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(article)})
        .then((response => {
            console.log(response);
            setArticle(DefaultEmptyArticle);

            navigate.push("/");
        }))
        .catch((error) => {
            console.error("Error:", error);
        });
    }



    return (
        <form noValidate onSubmit={onSubmit}>
            <div className="form-group">
                <input type="text" className="form-control" name="title" placeholder="Title of the journal" value={article.title} onChange={onChange} />
            </div>
            <button type="submit" className="btn">Submit</button>
        </form>
    );
        
};

export default CreateArticleComponent;