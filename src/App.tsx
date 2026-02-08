import { AppProvider, AuthProvider } from "@context/index.ts";
import {
  Collections,
  Home,
  Login,
  MatchYourVibe,
  NotFound,
  PinterestPrivacyPolicy,
  PrivacyPolicy,
  Account,
  Register,
} from "@pages/index.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-off-white text-black-rich">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/match-your-vibe" element={<MatchYourVibe />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/pinterest/privacy-policy"
          element={<PinterestPrivacyPolicy />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => (
  <>
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <Toaster />
          <AppContent />
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  </>
);

export default App;
