import React from "react";
import "../css/page-description.css";

export default function PageDescription(props) {
    // The page description component.
    // params: title -> string,
    //         para  -> string.
    return (
        <>
            <h1 className="text-right header-page mt-2 mb-4">{props.title}</h1>
            <p className="text-right para-page">{props.para}</p>
            <br />
        </>
    );
}
