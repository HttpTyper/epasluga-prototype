import { Link } from 'react-router-dom'
import { Card, Badge } from '../../design-system'
import type { Service } from '../../types/service'

export function CatalogCard({ service }: { service: Service }) {
  return (
    <Link to={`/service/${service.id}`} className="block h-full">
      <Card variant="interactive" className="h-full">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-semibold text-navy mb-1 leading-tight">{service.title}</h3>
          {service.authLevel === 'id' && <Badge variant="need-id">ID-карта</Badge>}
          {service.authLevel === 'ecp' && <Badge variant="ecp">ЭЦП</Badge>}
          {service.authLevel === 'none' && <Badge variant="accent">Без ID</Badge>}
        </div>
        
        <p className="text-sm text-muted flex-1 line-clamp-2 mb-4">{service.description}</p>
        
        <div className="flex items-center justify-between text-xs text-muted mt-auto pt-3 border-t border-line">
          <span className="font-semibold text-navy-deep">{service.category}</span>
          <span>⏱ {service.timeToComplete}</span>
        </div>
      </Card>
    </Link>
  )
}