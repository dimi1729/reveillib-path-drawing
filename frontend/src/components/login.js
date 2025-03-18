import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"

function Login() {

    const [username, SetUsername] = useState('')
    const [password, SetPassword] = useState('')

    async function submit(e) {
        e.preventDefault();
    }

    return(
        <div>
            <h1>Login</h1>

            <form action="POST">
                <input type="text" onChange={(e) => {SetUsername(e.target.value)}} placeholder='Username' />
                <input type="password" onChange={(e) => {SetPassword(e.target.value)}} placeholder='Password' />

                <input type="submit" />
            </form>

            <br />
            <Link to="/signup">Sign up</Link>
        </div>
    )
}