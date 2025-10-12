import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  currentTheme: "dark" | "light";
}

const getInitialTheme = (): "dark" | "light" => {
  const savedTheme = localStorage.getItem("theme") as "dark" | "light";
  return savedTheme || "dark";
};

const initialState: ThemeState = {
  currentTheme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<"dark" | "light">) {
      state.currentTheme = action.payload;
      localStorage.setItem("theme", action.payload);
      // Применяем тему к body
      document.body.className =
        action.payload === "light" ? "light-theme" : "dark-theme";
    },
    toggleTheme(state) {
      const newTheme = state.currentTheme === "dark" ? "light" : "dark";
      state.currentTheme = newTheme;
      localStorage.setItem("theme", newTheme);
      document.body.className =
        newTheme === "light" ? "light-theme" : "dark-theme";
    },
    initializeTheme(state) {
      const theme = getInitialTheme();
      state.currentTheme = theme;
      document.body.className =
        theme === "light" ? "light-theme" : "dark-theme";
    },
  },
});

export const { setTheme, toggleTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
