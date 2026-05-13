

import React from "react"
import { Link } from "react-router-dom"

export default function Header(){
    return(
        <header>
            <h1>Element Personality</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/quiz">Quiz</Link>
            </nav>
        </header>
    )
}
