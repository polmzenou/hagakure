/**
 * Formate une date selon la règle suivante :
 * - Si la date est au format AAAA-01-01 (1er janvier), affiche uniquement l'année AAAA
 * - Si la date a un mois et/ou un jour différent de 01-01, affiche la date complète formatée
 * 
 * @param dateString
 * @param fallback
 * @returns
 */
export function formatDate(dateString: string | null | undefined, fallback: string = '?'): string {
  if (!dateString) {
    return fallback
  }

  try {
    // parser la date au format ISO (AAAA-MM-JJ)
    const dateParts = dateString.split('-')
    
    if (dateParts.length !== 3) {
      // si le format n'est pas correct, retourner la date telle quelle
      return dateString
    }

    const year = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10)
    const day = parseInt(dateParts[2], 10)

    // vérifier si c'est le 1er janvier (01-01)
    if (month === 1 && day === 1) {
      // afficher uniquement l'année
      return year.toString()
    }

    // sinon, formater la date complète en français
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error)
    return dateString
  }
}

/**
 * Formate une date pour l'affichage dans une liste (format court)
 * - Si la date est au format AAAA-01-01, affiche uniquement l'année AAAA
 * - Sinon, affiche la date au format JJ/MM/AAAA
 * 
 * @param dateString
 * @param fallback
 * @returns
 */
export function formatDateShort(dateString: string | null | undefined, fallback: string = '?'): string {
  if (!dateString) {
    return fallback
  }

  try {
    const dateParts = dateString.split('-')
    
    if (dateParts.length !== 3) {
      return dateString
    }

    const year = parseInt(dateParts[0], 10)
    const month = parseInt(dateParts[1], 10)
    const day = parseInt(dateParts[2], 10)

    if (month === 1 && day === 1) {
      return year.toString()
    }

    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error)
    return dateString
  }
}
