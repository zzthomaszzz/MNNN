/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "@/component/Article";
import ArticleCard from "./ArticleCard";

function ShowArticleList() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        fetch("http://localhost:8082/api/articles")
            .then((response) => {
                return response.json();
            })
            .then((books) => {
                return setArticles(books);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    }, []);

    const articleList = articles.length === 0 ? "There is no article!" : articles.map((article, k) => <ArticleCard key={k} article={article} />);
    
    return(
    <div className='ShowArticleList'>
        <div className='container'>
            <div className='row'>
                <div className='col-md-12'>
                    <br />
                    <h2 className='display-4 text-center'>Books List</h2>
                </div>
                <div className='col-md-11'>
                    <Link href='/create-article' className='btn btn-outline-warning float-right'>
                    + Add New Book
                    </Link>
                    <br />
                    <br />
                    <hr />
                </div>
            </div>
            <div className='list'>{articleList}</div>
        </div>
    </div>
    );
}

export default ShowArticleList;