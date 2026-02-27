import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { FeedPage } from "@/pages/FeedPage";
import { PostDetailPage } from "@/pages/PostDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/c/general" replace />} />
          <Route path="/c/:slug" element={<FeedPage />} />
          <Route path="/c/:slug/post/:postId" element={<PostDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/c/general" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
