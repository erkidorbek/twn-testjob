import React, { useState, useEffect } from "react";
import TwnImage from "./TwnImage";
import { useParams } from "react-router-dom";
import Loader from "./Loader";

function Article() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const apiUrl = id ? `https://midaiganes.irw.ee/api/list/${id}` : "https://midaiganes.irw.ee/api/list/972d2b8a";

    useEffect(() => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setData(data))
            .then(() => setIsLoading(false));
    }, [apiUrl])

    return (
        <div className="wrapper">
            {isLoading ? <Loader /> :
                <article>
                    {data?.title && <h1 className="title">{data.title}</h1>}
                    {data?.intro && <div className="intro" dangerouslySetInnerHTML={{ __html: data.intro }}></div>}
                    {data?.image && <TwnImage imageUrl={data.image.large} imageTitle={data.image.title} imageAlt={data.image.alt} />}
                    {data?.body && <div className="article-body" dangerouslySetInnerHTML={{ __html: data.body }}></div>}
                    {data?.tags && <div className="article-tags">
                        {data.tags.map((tag, index) => <button className="btn-pill" key={index}>{tag}</button>)}
                    </div>}
                </article>
            }
        </div>
    )
}

export default Article;