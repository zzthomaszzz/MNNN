/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Article } from './Article';

interface IProp {
article?: Article;
}

const ArticleCard = ({ article }: IProp) => {
if (article == undefined) {
    return null;
}

return (
<div className='card-container' > 
    <img src='https://images.unsplash.com/photo-1495446815901-a7297e633e8d' alt='Books' height={200} />
    <div className='desc'>
        <h2>{article.title}</h2>
        <h3>{article.author}</h3>
        <p>{article.summary_brief}</p>
    </div>
</div>
);
};

export default ArticleCard;