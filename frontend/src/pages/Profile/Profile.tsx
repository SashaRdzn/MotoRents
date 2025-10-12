import { useEffect, useState, useRef } from "react";
import {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateRoleMutation,
  useUploadAvatarMutation,
  useUpdateThemeMutation,
} from "@/app/api/api";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { setTheme } from "@/app/store/slices/themeSlice";
import styles from "./profile.module.scss";
import { useToast } from "@/components/Toast/ToastProvider";

const Profile = () => {
  const { data } = useGetMeQuery();
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const [updateRole, { isLoading: isRoleLoading }] = useUpdateRoleMutation();
  const [uploadAvatar, { isLoading: isAvatarLoading }] =
    useUploadAvatarMutation();
  const [updateTheme, { isLoading: isThemeLoading }] = useUpdateThemeMutation();
  const { show } = useToast();
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    driving_experience: 0,
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);
  const [pendingRole, setPendingRole] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = (data as any)?.user;
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        phone: user.phone ?? "",
        driving_experience: user.driving_experience ?? 0,
      });
      setSelectedRole(data?.role ?? "client");
    }
  }, [data]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMe(form as any).unwrap();
      show("Профиль обновлен", "success");
    } catch (e) {
      show("Не удалось обновить профиль", "error");
    }
  };

  const handleRoleChange = (newRole: string) => {
    setPendingRole(newRole);
    setShowRoleConfirm(true);
  };

  const confirmRoleChange = async () => {
    try {
      await updateRole({ role: pendingRole }).unwrap();
      setSelectedRole(pendingRole);
      show("Роль обновлена", "success");
      setShowRoleConfirm(false);
    } catch (e) {
      show("Не удалось обновить роль", "error");
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar(formData).unwrap();
      show("Аватар обновлен", "success");
    } catch (e: any) {
      show(e.data?.detail || "Не удалось загрузить аватар", "error");
    }
  };

  const handleThemeChange = async (newTheme: "dark" | "light") => {
    try {
      await updateTheme({ theme: newTheme }).unwrap();
      dispatch(setTheme(newTheme));
      show("Тема изменена", "success");
    } catch (e: any) {
      show("Не удалось изменить тему", "error");
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarContainer}>
          {(data as any)?.avatar_url ? (
            <img
              src={(data as any).avatar_url}
              alt='Аватар'
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <span>Фото</span>
            </div>
          )}
          <button
            className={styles.avatarButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={isAvatarLoading}
          >
            {isAvatarLoading ? "Загрузка..." : "Изменить фото"}
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleAvatarUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className={styles.roleSection}>
        <h3>Роль</h3>
        {(data as any)?.user?.role === "admin" ||
        (data as any)?.user?.role === "superuser" ? (
          <div className={styles.adminRole}>
            <div className={styles.adminBadge}>Администратор</div>
            <p className={styles.roleDescription}>
              У вас есть полный доступ ко всем функциям системы
            </p>
          </div>
        ) : (
          <>
            <div className={styles.roleButtons}>
              <button
                type='button'
                className={`${styles.roleButton} ${
                  selectedRole === "client" ? styles.active : ""
                }`}
                onClick={() => handleRoleChange("client")}
                disabled={isRoleLoading}
              >
                Клиент
              </button>
              <button
                type='button'
                className={`${styles.roleButton} ${
                  selectedRole === "landlord" ? styles.active : ""
                }`}
                onClick={() => handleRoleChange("landlord")}
                disabled={isRoleLoading}
              >
                Арендодатель
              </button>
            </div>
            <p className={styles.roleDescription}>
              {selectedRole === "client"
                ? "Как клиент вы можете арендовать мотоциклы"
                : "Как арендодатель вы можете добавлять свои мотоциклы для аренды"}
            </p>
          </>
        )}
      </div>
      <div className={styles.themeSection}>
        <h3>Тема оформления</h3>
        <div className={styles.themeButtons}>
          <button
            type='button'
            className={`${styles.themeButton} ${
              currentTheme === "dark" ? styles.active : ""
            }`}
            onClick={() => handleThemeChange("dark")}
            disabled={isThemeLoading}
          >
            🌙 Темная
          </button>
          <button
            type='button'
            className={`${styles.themeButton} ${
              currentTheme === "light" ? styles.active : ""
            }`}
            onClick={() => handleThemeChange("light")}
            disabled={isThemeLoading}
          >
            ☀️ Светлая
          </button>
        </div>
        <p className={styles.themeDescription}>
          {currentTheme === "dark"
            ? "Используется темная тема оформления"
            : "Используется светлая тема оформления"}
        </p>
      </div>

      <form className={styles.form} onSubmit={submit}>
        <label>
          Имя
          <input
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
        </label>
        <label>
          Фамилия
          <input
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
        </label>
        <label>
          Телефон
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label>
          Стаж вождения (лет)
          <input
            type='number'
            value={form.driving_experience}
            onChange={(e) =>
              setForm({ ...form, driving_experience: Number(e.target.value) })
            }
          />
        </label>
        <button disabled={isLoading}>Сохранить</button>
      </form>
      {showRoleConfirm && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmContent}>
            <h3>Подтверждение смены роли</h3>
            <p>
              Вы уверены, что хотите изменить роль на "
              {pendingRole === "client" ? "Клиент" : "Арендодатель"}"?
            </p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.confirmButton}
                onClick={confirmRoleChange}
                disabled={isRoleLoading}
              >
                Подтвердить
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowRoleConfirm(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
