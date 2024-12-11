export const categories = {
  "Datos personales": [
    "DNI",
    "name",
    "surname",
    "secondSurname",
    "dateOfBirth",
    "placeOfBirth",
    "personalPhoneNumber",
    "personalEmail",
    "address",
    "city",
    "nationality",
  ],
  Family: [
    "partnerStatus",
    "partnerName",
    "partnerStatus",
    "partnerOccupation",
    "numOfSons",
  ],
  Trabajo: [
    "employmentStartDate",
    "employed",
    "jobTitle",
    "companyName",
    "taxId",
    "monthlyIncome",
    "annualIncome",
  ],
  "Agencia imobiliaria": [
    "agency",
    "agencyAgent",
    "agencyOffertMade",
    "agencyOffertAccepted",
    "noteAgency",
  ],

  "Banco Personal": [
    "personalBank",
    "IBANpersonalBank",
    "secondBank",
    "IBANsecondBank",
    "existingDebtsNote",
    "availableFunds",
  ],

  Hipoteca: [
    "mortgageBank",
    "mortgageRequestPercentage",
    "mortageYears",
    "dateFeinReceived",
    "dateExpireFein",
  ],

  Prestamo: ["loanCompany", "loanMoneyRequestDate", "loanMoneyRequest"],

  Notario: [
    "notaryCompany",
    "notaryName",
    "notaryPhoneNumber",
    "dataOfDeed",
    "noteNotary",
  ],

  "Fechas importante": [
    "dateExpireSim",
    "dateFeinReceived",
    "dateExpireFein",
    "dataOfDeed",
  ],
  "Piso en venta": [
    "propertyAddress",
    "propertyCap",
    "propertyCity",
    "propertyPrice",
    "propertyMq",
  ],
  Otro: [
    "serviceType",
    "howKnowUs",
    "generatedSIM",
    "generatedEmail",
    "generatedEmailPassword",
    "createDate",
    "folderDocument",
    "latestChangeDate",
    "authorizedRepresentative",
    "agent",
    "noteInternal",
  ],
}

export const moneyFields = [
  "annualIncome",
  "monthlyIncome",
  "availableFunds",
  "agencyOffertMade",
  "loanMoneyRequest",
  "mortgageRequestPercentage",
  "propertyPrice",
  "availableFunds",
]

export const dateFields = [
  "createDate",
  "latestChangeDate",
  "dataofdeed",
  "dateFeinReceived",
  "dateExpireFein",
  "dateExpireSim",
  "dataOfDeed",
]
export const formatToEuro = (value) => {
  if (typeof value === "number") {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }
  return value // Ritorna il valore originale se non è un numero
}

export const translateKey = (key) => {
  const translations = {
    dni: "DNI",
    name: "Nombre",
    surname: "Apellido",
    secondSurname: "Segundo Apellido",
    dateOfBirth: "Fecha de Nacimiento",
    placeOfBirth: "Lugar de Nacimiento",
    personalEmail: "Correo Electrónico Personal",
    personalPhoneNumber: "Teléfono Personal",
    address: "Dirección",
    city: "Ciudad",
    nationality: "Nacionalidad",
    companyName: "Nombre de la Empresa",
    employed: "Empleado",
    autonomo: "Autónomo",
    taxId: "taxId",
    jobTitle: "Título del Trabajo",
    employmentStartDate: "Fecha de Inicio del Empleo",
    authorizedRepresentative: "Representante Autorizado",
    annualIncome: "Ingreso Anual",
    monthlyIncome: "Ingreso Mensual",
    existingDebtsNote: "Deudas Existentes",
    availableFunds: "Fondos Disponibles",
    mortgageRequestPercentage: "Porcentaje Hipoteca",
    mortgageBank: "Banco Hipotecario",
    numOfSons: "Número de Hijos",
    partnerName: "Nombre de la Pareja",
    partnerStatus: "Estado de la Pareja",
    partnerOccupation: "Ocupación de la Pareja",
    personalBank: "Banco Personal",
    IBANpersonalBank: "IBAN del Banco Personal",
    secondBank: "Segundo Banco",
    IBANsecondBank: "IBAN del Segundo Banco",
    generatedEmail: "Correo Electrónico Generado",
    generatedEmailPassword: "Contraseña del Correo Electrónico Generado",
    generatedSIM: "SIM Generada",
    agent: "Nuestro Agente",
    notaryName: "Nombre del Notario",
    notaryCompany: "Empresa del Notario",
    notaryPhoneNumber: "Teléfono del Notario",
    dateExpireSim: "Expiración de la SIM",
    dateExpireFein: "Caducidad del FEIN",
    dateFeinReceived: "Recepción del FEIN",
    dataofdeed: "Fecha del Acto",
    agency: "Agencia",
    agencyAgent: "Agente de la Agencia",
    agencyOffertMade: "Oferta Realizada por la Agencia",
    agencyOffertAcceptedFromTheOWner: "Oferta Aceptada dal dueño",
    loanCompany: "Empresa de Préstamo",
    loanMoneyRequest: "Valor del préstamo",
    loanMoneyRequestDate: "Fecha de Solicitud del Préstamo",
    propertyAddress: "Dirección",
    propertyCity: "Ciudad",
    propertyPrice: "Precio",
    propertyMq: "Metros Cuadrados",
    createDate: "Fecha de Creación",
    latestChangeDate: "Último Cambio",
    howKnowUs: "Cómo nos Conociste",
    folderDocument: "Documentos",
    note: "Nota",
    noteNotary: "Nota del Notario",
    noteAgency: "Nota de la Agencia",
    propertyCap: "Cap",
    noteInternal: "Nota interna",
  }

  return translations[key] || key
}