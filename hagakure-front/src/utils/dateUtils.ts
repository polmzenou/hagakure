/**
 * Formate une date selon la règle suivante :
 * - Si la date est au format AAAA-01-01 (1er janvier), affiche uniquement l'année AAAA
 * - Si la date a un mois et/ou un jour différent de 01-01, affiche la date complète formatée
 * 
 * @param dateString - Date au format ISO (AAAA-MM-JJ) ou null/undefined
 * @param fallback - Valeur à retourner si la date est null/undefined (défaut: '?')
 * @returns Date formatée ou fallback
 */
export function formatDate(dateString: string | null | undefined, fallback: string = '?'): string {
  if (!dateString) {
    return fallback
  }

  try {
    // Parser la date au format ISO (AAAA-MM-JJ)
    const dateParts = dateString.split('-')
    
    if (dateParts.length !== 3) {
      // Si le format n'est pas correct, retourner la date telle quelle
      return dateString
    }

    const year = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10)
    const day = parseInt(dateParts[2], 10)

    // Vérifier si c'est le 1er janvier (01-01)
    if (month === 1 && day === 1) {
      // Afficher uniquement l'année
      return year.toString()
    }

    // Sinon, formater la date complète en français
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    // En cas d'erreur, retourner la date originale
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Formate une date pour l'affichage dans une liste (format court)
 * - Si la date est au format AAAA-01-01, affiche uniquement l'année AAAA
 * - Sinon, affiche la date au format JJ/MM/AAAA
 * 
 * @param dateString - Date au format ISO (AAAA-MM-JJ) ou null/undefined
 * @param fallback - Valeur à retourner si la date est null/undefined (défaut: '?')
 * @returns Date formatée ou fallback
 */
export function formatDateShort(dateString: string | null | undefined, fallback: string = '?'): string {
  if (!dateString) {
    return fallback
  }

  try {
    // Parser la date au format ISO (AAAA-MM-JJ)
    const dateParts = dateString.split('-')
    
    if (dateParts.length !== 3) {
      return dateString
    }

    const year = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10)
    const day = parseInt(dateParts[2], 10)

    // Vérifier si c'est le 1er janvier (01-01)
    if (month === 1 && day === 1) {
      return year.toString()
    }

    // Sinon, formater la date au format JJ/MM/AAAA
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}
