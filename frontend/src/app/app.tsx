import { RouterProvider } from 'react-router-dom';
import { router } from './Routes/router';


export function App() {
  return <RouterProvider router={router} />;
} 