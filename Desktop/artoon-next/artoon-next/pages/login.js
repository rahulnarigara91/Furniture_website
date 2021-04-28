import React, { useState } from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';

const Login = () => {
	const [loginError, setLoginError] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
	}
	return (
		<>
			<form onSubmit={handleSubmit}>
				<p>Login</p>
				<input
					name='email'
					type='email'
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<input
					name='password'
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<input type='submit' value='Submit' />
				{loginError && <p style={{ color: 'red' }}>loginError</p>}
			</form>
		</>
	);
};

export default Login;
