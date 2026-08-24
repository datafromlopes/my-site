import { Navigate, Route, Routes } from 'react-router'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { ResearchIndex } from '@/pages/ResearchIndex'
import { PublicationPage } from '@/pages/PublicationPage'
import { ProjectsIndex } from '@/pages/ProjectsIndex'
import { ProjectPage } from '@/pages/ProjectPage'
import { WritingIndex } from '@/pages/WritingIndex'
import { PostPage } from '@/pages/PostPage'
import { CV } from '@/pages/CV'
import { NotFound } from '@/pages/NotFound'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="research" element={<ResearchIndex />} />
        <Route path="research/:slug" element={<PublicationPage />} />

        <Route path="projects" element={<ProjectsIndex />} />
        <Route path="projects/:slug" element={<ProjectPage />} />

        <Route path="writing" element={<WritingIndex />} />
        <Route path="writing/:slug" element={<PostPage />} />

        <Route path="cv" element={<CV />} />

        {/* Legacy Hugo paths. The worker 301s these server-side; these are the belt to that's braces. */}
        <Route path="articles" element={<Navigate to="/research" replace />} />
        <Route path="articles/:slug" element={<Navigate to="/research" replace />} />
        <Route path="blog" element={<Navigate to="/writing" replace />} />

        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
