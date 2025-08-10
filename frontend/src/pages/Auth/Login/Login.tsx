import { useState } from 'react';
import { useLoginMutation } from '@api/api';
import styles from './login.module.scss';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token } = await login({ email, password }).unwrap();
            localStorage.setItem('tokenAC', token);
            console.log(token);
            
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <section className={styles.login}>
            <div className={styles.loginCard}>
                <h2 className={styles.title}>Добро пожаловать</h2>
                <p className={styles.subtitle}>Введите ваши данные для входа</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>
                            {'data' in error ? error?.data?.message : 'Ошибка входа'}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Нет аккаунта? <Link to={"/auth/register"} className={styles.link}>Зарегистрироваться</Link></p>
                </div>
            </div>
        </section>
    );
};

export default Login;