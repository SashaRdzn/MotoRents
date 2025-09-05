import { useState } from 'react';
import { useRegisterMutation, useSend_codeMutation, useVerify_codeMutation } from '@api/api';
import { Link, useNavigate } from 'react-router-dom';
import { CheckEmailOnApproveDomen } from '@/utils/utils';
import styles from '../login.module.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: ''
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [register] = useRegisterMutation();
  const [send_code] = useSend_codeMutation();
  const [verify_code] = useVerify_codeMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmitSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.email) {
        throw new Error('Введите email');
      }

      if (!CheckEmailOnApproveDomen(formData.email)) {
        throw new Error('Используйте почту с домена gmail.com, yandex.ru и т.д.');
      }

      await send_code({ email: formData.email }).unwrap();
      setStep(1);
    } catch (err: any) {
      setError(err.data?.message || err.message || 'Не удалось отправить код. Попробуйте позже');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.code || formData.code.length !== 4) {
        throw new Error('Введите 4-значный код');
      }

      await verify_code({
        email: formData.email,
        code: formData.code
      }).unwrap();

      setStep(2);
    } catch (err: any) {
      setError(err.data?.message || 'Неверный код подтверждения');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.password || formData.password.length < 8) {
        throw new Error('Пароль должен содержать минимум 8 символов');
      }

      const { token } = await register({
        email: formData.email,
        password: formData.password
      }).unwrap();

      localStorage.setItem('tokenAC', token);
      navigate('/');
    } catch (err: any) {
      setError(err.data?.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="example@gmail.com"
                required
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Отправка...' : 'Получить код'}
            </button>
          </>
        );
      case 1:
        return (
          <>
            <div className={styles.emailDisplay}>{formData.email}</div>
            <div className={styles.inputGroup}>
              <label htmlFor="code" className={styles.label}>Код подтверждения</label>
              <input
                id="code"
                type="text"
                value={formData.code}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="1234"
                required
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Проверка...' : 'Подтвердить код'}
            </button>
          </>
        );
      case 2:
        return (
          <>
            <div className={styles.emailDisplay}>{formData.email}</div>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Пароль</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Не менее 8 символов"
                required
                minLength={8}
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section className={styles.login}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Регистрация</h2>
        <p>Есть аккаунт? <Link to="/auth/login" className={styles.link}>Вход</Link></p>

        <p className={styles.subtitle}>Шаг {step + 1} из 3</p>

        <form
          onSubmit={
            step === 0 ? handleSubmitSendCode :
              step === 1 ? handleVerifyCode :
                handleSubmitRegister
          }
          className={styles.form}
        >
          {renderStep()}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Register;