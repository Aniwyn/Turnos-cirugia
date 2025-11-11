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

export const formatDateFromDB = (stringDate) => {
    return new Date(stringDate).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

export const formatTimeFromDB = (stringDate) => {
    return new Date(stringDate).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}