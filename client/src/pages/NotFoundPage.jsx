import React from 'react';
import {Link} from "react-router-dom";
import "../styles/NotFoundPage.css"
const NotFoundPage = () => {
    return (
        <div className="NotFound_container">
            <p>Данная страница не существует</p>
            <Link to="/login">
                <button className="NotFound_button">На главную</button>
            </Link>
        </div>
    );
};

export default NotFoundPage;