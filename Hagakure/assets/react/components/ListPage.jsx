import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function createListPage(title, icon, api, path, columns) {
  return function ListPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      loadItems()
    }, [])

    const loadItems = async () => {
      try {
        const data = await api.getAll()
        setItems(data)
        setLoading(false)
      } catch (error) {
        console.error(`Error loading ${title}:`, error)
        setLoading(false)
      }
    }

    const handleDelete = async (id) => {
      if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
        try {
          await api.delete(id)
          loadItems()
        } catch (error) {
          console.error(`Error deleting ${title}:`, error)
        }
      }
    }

    if (loading) return <div className="loading">Chargement...</div>

    return (
      <div className="app">
        <Header />
        <div className="list-container">
          <div className="list-header">
            <h1>{icon} {title}</h1>
            <div className="list-actions">
              <Link to="/" className="btn btn-secondary">← Retour</Link>
              <Link to={`${path}/new`} className="btn btn-primary">+ Nouveau</Link>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">
              <p>Aucun élément enregistré.</p>
              <Link to={`${path}/new`} className="btn btn-primary">Créer le premier élément</Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map(col => <th key={col.key}>{col.label}</th>)}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      {columns.map(col => (
                        <td key={col.key} className={col.className || ''}>
                          {col.render ? col.render(item) : item[col.key]}
                        </td>
                      ))}
                      <td className="actions-cell">
                        <Link to={`${path}/${item.id}/edit`} className="btn-icon btn-edit" title="Modifier">
                          ✏️
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="btn-icon btn-delete"
                          title="Supprimer"
                        >
                          🗑️
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
}

export default createListPage

