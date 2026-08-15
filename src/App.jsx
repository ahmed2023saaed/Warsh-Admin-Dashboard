import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ top: 20 }}
      />
    </AuthProvider>
  );
}

export default App;
