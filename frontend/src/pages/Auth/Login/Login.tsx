import { useState } from 'react';
import { useLoginMutation, useGetMeQuery } from '@api/api';
import styles from '../login.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTokens, setUser } from '@/app/store/slices/authSlice';
import { useToast } from '@/components/Toast/ToastProvider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { show } = useToast();

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            const access = (res as any)?.data?.user_token?.access;
            const refresh = (res as any)?.data?.user_token?.refresh;
            if (access && refresh) {
                dispatch(setTokens({ access, refresh }));
                localStorage.setItem('token_access', access);
                localStorage.setItem('token_refresh', refresh);
            }
            dispatch(setUser({ email }));
            show('Успешный вход', 'success');
            navigate('/home');
        } catch (err) {
            console.error('Login failed:', err);
            show('Ошибка входа', 'error');
        }
    };

    return (
        <section className={styles.login}>
            <div className={styles.loginCard}>
                <h2 className={styles.title}>Вход</h2>
                <p>Нет аккаунта? <Link to={"/auth/register"} className={styles.link}>Регистрация</Link></p>
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
            </div>
        </section>
    );
};

export default Login;