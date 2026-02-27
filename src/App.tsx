import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { FeedPage } from "@/pages/FeedPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { CommentDetailPage } from "@/pages/CommentDetailPage";
import { CreatePostPage } from "@/pages/CreatePostPage";
import { SearchPage } from "@/pages/SearchPage";
import { NewsPage } from "@/pages/NewsPage";
import { NewsDetailPage } from "@/pages/NewsDetailPage";
import { NewsCommentDetailPage } from "@/pages/NewsCommentDetailPage";
import { CommunitiesPage } from "@/pages/CommunitiesPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NavigationProvider>
        <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/news/:newsId/comment/:commentId" element={<NewsCommentDetailPage />} />
          <Route path="/c/:slug" element={<FeedPage />} />
          <Route path="/c/:slug/post/new" element={<CreatePostPage />} />
          <Route path="/c/:slug/post/:postId" element={<PostDetailPage />} />
          <Route path="/c/:slug/post/:postId/comment/:commentId" element={<CommentDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        </NavigationProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
