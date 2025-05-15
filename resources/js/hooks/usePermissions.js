// resources/js/hooks/usePermissions.js
import { usePage } from '@inertiajs/react';

export default function usePermissions() {
  const { props } = usePage();
  const permisos = props.auth?.permissions || [];

  const can = (permiso) => permisos.includes(permiso);
  const canAny = (permisosNecesarios) => permisosNecesarios.some(p => permisos.includes(p));
  const canAll = (permisosNecesarios) => permisosNecesarios.every(p => permisos.includes(p));

  return { can, canAny, canAll };
}
