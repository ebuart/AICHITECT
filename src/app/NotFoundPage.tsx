import { Link } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { paths } from '@/routes/paths'

export function NotFoundPage() {
  return (
    <PagePlaceholder
      phase="PHASE_0"
      title="404"
      description="Diese Seite existiert nicht. Zurück zur Roadmap."
    >
      <Link to={paths.home} className="text-sm font-medium text-deck-accent">
        Zur Startseite
      </Link>
    </PagePlaceholder>
  )
}
