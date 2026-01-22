export const capitalizeFirstLetter = (str) => {
    if (typeof str !== "string" || str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const formatCurrency = (number) => {
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number)
}

export const formatDateFromDB = (value) => {
  if (!value) return ""

  const s = String(value).trim()
  const datePart = s.slice(0, 10)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return ""

  const [y, m, d] = datePart.split("-").map(Number)

  return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

export const formatShortDateFromDB = (stringDate) => {
    return new Date(stringDate).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit"
    })
}

export const formatTimeFromDB = (stringDate) => {
    return new Date(stringDate).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}

export const formatDateTimeFromDB = (stringDate) => {
    const date = new Date(stringDate)
    const dateStr = date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
    const timeStr = date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
    return `${dateStr} - ${timeStr}`
}

export const formatDNI = (dni) => {
    return new Intl.NumberFormat('es-AR').format(dni)
}

export const userCanSeeItem = (item, userRole, userRoleGroup) => {
    if (item.roles && item.roles.includes(userRole)) {38
        return true
    }

    if (item.roleGroups && item.roleGroups.includes(userRoleGroup)) {
        return true
    }

    return false
}

export const uint8ToBase64 = (u8) => {
    let binary = ''
    const chunkSize = 0x8000
    for (let i = 0; i < u8.length; i += chunkSize) {
        binary += String.fromCharCode(...u8.slice(i, i + chunkSize))
    }
    return btoa(binary)
}
