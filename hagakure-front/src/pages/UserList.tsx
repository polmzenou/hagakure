import { useState, useEffect } from 'react'
import { userApi, type UserAdmin } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './List.css'
import './Form.css'

interface UserRow extends UserAdmin {
  editEmail: string
  editRole: 'user' | 'admin'
  saving: boolean
}

function UserList() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async () => {
    setError(null)
    try {
      const data = await userApi.getAll()
      setUsers(
        (Array.isArray(data) ? data : []).map((u) => ({
          ...u,
          editEmail: u.email,
          editRole: u.roles?.includes('ROLE_ADMIN') ? 'admin' : 'user',
          saving: false,
        }))
      )
    } catch (err: unknown) {
      console.error('Error loading users:', err)
      setError((err as { message?: string })?.message || 'Impossible de charger les utilisateurs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSave = async (row: UserRow) => {
    const idx = users.findIndex((u) => u.id === row.id)
    if (idx < 0) return
    setUsers((prev) =>
      prev.map((u) => (u.id === row.id ? { ...u, saving: true } : u))
    )
    try {
      await userApi.update(row.id, {
        email: row.editEmail.trim(),
        roles: row.editRole === 'admin' ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER'],
      })
      setUsers((prev) =>
        prev.map((u) =>
          u.id === row.id
            ? {
                ...u,
                email: row.editEmail.trim(),
                roles: row.editRole === 'admin' ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER'],
                saving: false,
              }
            : u
        )
      )
    } catch (err: unknown) {
      setUsers((prev) =>
        prev.map((u) => (u.id === row.id ? { ...u, saving: false } : u))
      )
      alert((err as { message?: string })?.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
    try {
      await userApi.delete(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  const updateRow = (id: number, field: 'editEmail' | 'editRole', value: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    )
  }

  if (loading) return <div className="loading">Chargement...</div>

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="list-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Gestion des utilisateurs</h1>
            </div>
          </div>
          <div className="list-error">
            <p>{error}</p>
            <button type="button" className="btn-retry" onClick={loadUsers}>
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      <div className="list-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Gestion des utilisateurs</h1>
            <p className="page-subtitle">
              Modifier les comptes et les rôles (User / Admin).
            </p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <p>Aucun utilisateur.</p>
          </div>
        ) : (
          <div className="table-container" role="region" aria-label="Liste des utilisateurs">
            <table className="data-table" aria-describedby="users-table-desc">
              <caption id="users-table-desc" className="sr-only">Tableau de gestion des utilisateurs avec email et rôle modifiables</caption>
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Email</th>
                  <th scope="col">Rôle</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      <input
                        type="email"
                        className="form-control user-email-input"
                        value={row.editEmail}
                        onChange={(e) => updateRow(row.id, 'editEmail', e.target.value)}
                        aria-label={`Email de l'utilisateur ${row.id}`}
                        autoComplete="email"
                      />
                    </td>
                    <td>
                      <select
                        className="form-control user-role-select"
                        value={row.editRole}
                        onChange={(e) =>
                          updateRow(row.id, 'editRole', e.target.value as 'user' | 'admin')
                        }
                        aria-label={`Rôle de l'utilisateur ${row.id}`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={row.saving}
                        aria-busy={row.saving}
                        aria-label={`Enregistrer les modifications de l'utilisateur ${row.id}`}
                        onClick={() => handleSave(row)}
                      >
                        {row.saving ? '...' : 'Enregistrer'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        aria-label={`Supprimer l'utilisateur ${row.id}`}
                        onClick={() => handleDelete(row.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default UserList
