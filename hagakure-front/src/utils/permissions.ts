export const isAdmin = (): boolean => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return false
  
  try {
    const user = JSON.parse(userStr)
    return user.roles && user.roles.includes('ROLE_ADMIN')
  } catch {
    return false
  }
}

export const canCreate = (): boolean => isAdmin()
export const canEdit = (): boolean => isAdmin()
export const canDelete = (): boolean => isAdmin()
export const canView = (): boolean => {
  return true
}

