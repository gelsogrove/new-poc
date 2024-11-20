// Function to add a loading message from the bot
export const addBotLoadingMessage = (setMessages) => {
  setMessages((prevMessages) => [
    ...prevMessages,
    { id: crypto.randomUUID(), sender: "bot", text: "..." }, // Placeholder for loading message
  ])
}

// Function to replace the bot's last message with an error message
export const replaceBotMessageWithError = (setMessages, errorMessage) => {
  setMessages((prevMessages) =>
    prevMessages.slice(0, -1).concat({
      id: crypto.randomUUID(),
      sender: "bot",
      text: errorMessage,
    })
  )
}

// Function to load embedding data from a given URL
export const loadEmbeddingData = async (url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to load embedding data")
    return await response.json()
  } catch (error) {
    console.error("Embedding loading error:", error)
    return null
  }
}

export const formatText = (data) => {
  if (typeof data === "string") {
    const jsonStringMatch = data.match(/{.*}/s) // Matches the first JSON object found in the string

    if (jsonStringMatch) {
      const jsonString = jsonStringMatch[0] // Extracted JSON string
      try {
        const jsonData = JSON.parse(jsonString) // Parse the extracted JSON string
        return extractResponseData(jsonData) // Update this function to return page too
      } catch (error) {
        console.error("Error parsing input string:", error)
        return {
          formattedResponse: "Invalid input format.",
          options: [],
          page: null,
        } // Return the original string if parsing fails
      }
    } else {
      // If no JSON was found, return the original data
      return { formattedResponse: data, options: [] }
    }
  }

  const x = extractResponseData(data)
  console.log(x)
  return x
}

// Update the extractResponseData function to return the page number
const extractResponseData = (data) => {
  if (typeof data === "object" && data.response) {
    return {
      formattedResponse: data.response.trim(),
      options: Array.isArray(data.options) ? data.options : [],
      page: data.page || null, // Return the page number, defaulting to null if it doesn't exist
    }
  }

  console.error(
    "Invalid input format: Data does not contain expected structure."
  )
  return { formattedResponse: "Invalid input format.", options: [], page: null }
}

export const cleanText = (text) => {
  return text
    .replace(/\\n/g, " ") // Sostituisce \n con uno spazio
    .replace(/\\r/g, "") // Rimuove \r se presente
    .replace(/\s+/g, " ") // Riduce spazi bianchi multipli a uno
    .trim() // Rimuove spazi all'inizio e alla fine
}

export const formatBoldText = (text) => {
  // Sostituisci le interruzioni di riga con <br>
  text = text.replace(/\n/g, "<br>")

  // Sostituisci **testo** con <b>testo</b>
  return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
}

export const filterData = (input, jsonData) => {
  const data = jsonData // Analizza il JSON pulito

  if (!data?.customers?.length) {
    return {
      Answer: "No data available.",
      results: [],
    }
  }

  const { numofElement, filters, actions } = input

  // Helpers
  const parseDate = (dateStr) => new Date(dateStr)

  const filterByDate = (customers, from, to) => {
    // Se non sono forniti 'from' e 'to', restituisci tutti i clienti
    if (!from && !to) return customers

    return customers.filter(({ order_date }) => {
      if (!order_date?.raw) return false
      const [start] = order_date.raw.split(" - ")
      const orderDate = parseDate(start)
      return orderDate >= parseDate(from) && orderDate <= parseDate(to)
    })
  }

  const filterByFarm = (customers, farm) => {
    if (!farm) return customers // Return all customers if farm is not provided
    return customers.filter(({ name }) => name.includes(farm))
  }

  const filterByProduct = (customers, product) => {
    if (!product) return customers
    return customers.filter(({ items }) =>
      items.some(({ description }) => description.includes(product))
    )
  }

  const filterByQuantity = (customers, quantity) => {
    if (!quantity) return customers // Return all customers if quantity is not provided
    const operator = quantity.slice(0, 2) // Get the operator (e.g., '>=', '<=', etc.)
    const value = parseInt(quantity.slice(3), 10) // Get the numeric value

    return customers.filter(({ total_quantity }) => {
      if (operator === ">=") return total_quantity >= value
      if (operator === "<=") return total_quantity <= value
      return true // Default case (no filtering)
    })
  }

  const filterByPrice = (customers, price) => {
    if (!price) return customers // Return all customers if price is not provided
    const operator = price.slice(0, 2) // Get the operator (e.g., '>=', '<=', etc.)
    const value = parseFloat(price.slice(3)) // Get the numeric value

    return customers.filter(({ total_price }) => {
      if (operator === ">=") return total_price >= value
      if (operator === "<=") return total_price <= value
      return true // Default case (no filtering)
    })
  }

  const getAllFarms = (customers, numOfElement) => {
    const previousNumOfElement = numOfElement !== null ? numOfElement : Infinity // Usa il valore passato o Infinity
    const farms = customers.map(({ name }) => name)
    return farms.length ? farms.slice(0, previousNumOfElement) : farms
  }

  // Funzione di utilità per ottenere il valore attuale o il precedente
  const getValueOrPrevious = (currentValue, previousValue) => {
    return currentValue !== null ? currentValue : previousValue
  }

  const getAllOrders = (
    customers,
    numOfElement,
    previousNumOfElement = Infinity
  ) => {
    const currentNumOfElement = getValueOrPrevious(
      numOfElement,
      previousNumOfElement
    ) // Usa il valore attuale o il precedente
    const customerMap = {}

    customers.forEach((customer) => {
      // Utilizziamo l'ID del cliente come chiave per garantire l'unicità
      if (!customerMap[customer.customer_id]) {
        customerMap[customer.customer_id] = {
          customer_id: customer.customer_id,
          name: customer.name,
          total_quantity: customer.total_quantity,
          total_price: customer.total_price,
          items: customer.items,
        }
      }
    })

    // Convertiamo l'oggetto in un array
    return Object.values(customerMap)
  }

  const getAllProducts = (
    customers,
    numOfElement,
    orderBy,
    previousNumOfElement = Infinity,
    previousOrderBy = null
  ) => {
    // Use the current numOfElement or fallback to previousNumOfElement if null
    const currentNumOfElement =
      numOfElement !== null ? numOfElement : previousNumOfElement
    const currentOrderBy = getValueOrPrevious(orderBy, previousOrderBy) // Usa il valore attuale o il precedente

    // Creiamo un oggetto per accumulare i prodotti univoci
    const productMap = {}

    customers.forEach((customer) => {
      customer.items.forEach((item) => {
        if (productMap[item.description]) {
          // Se il prodotto esiste già, sommiamo quantità e prezzo
          productMap[item.description].quantity += item.quantity
          productMap[item.description].price += item.price
        } else {
          // Altrimenti, lo aggiungiamo al map
          productMap[item.description] = {
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          }
        }
      })
    })

    // Convertiamo l'oggetto in un array
    const products = Object.values(productMap)

    // Sort products based on the currentOrderBy parameter
    if (currentOrderBy) {
      products.sort((a, b) => {
        if (currentOrderBy === "price asc") {
          return a.price - b.price // Ascending order
        } else if (currentOrderBy === "price desc") {
          return b.price - a.price // Descending order
        }
        return 0 // Default case (no sorting)
      })
    }

    // Return only the first numOfElement if there are filters
    return products.length ? products.slice(0, currentNumOfElement) : products
  }

  const getOrder = (customers, orderId) => {
    return (
      customers.find((customer) => customer.customer_id === orderId) || null
    )
  }

  const getProduct = (customers, productName) => {
    return (
      customers
        .flatMap((customer) => customer.items)
        .find((item) => item.description.includes(productName)) || null
    )
  }

  const getFarm = (customers, farmName) => {
    return (
      customers.find((customer) => customer.name.includes(farmName)) || null
    )
  }

  const getFarmPrice = (customers, farmName) => {
    const farm = customers.find((customer) => customer.name.includes(farmName))
    return farm ? farm.total_price : 0
  }

  const getTopFarms = (customers, limit) => {
    return customers
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, limit)
  }

  const getTopProducts = (customers, limit) => {
    const productCounts = customers.reduce((acc, { items }) => {
      items.forEach(({ description, quantity }) => {
        acc[description] = (acc[description] || 0) + quantity
      })
      return acc
    }, {})
    return Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([description, quantity]) => ({ description, quantity }))
  }

  const getFarmTotalPriceButRemoveProduct = (
    customers,
    farmName,
    productName
  ) => {
    const farm = customers.find((customer) => customer.name.includes(farmName))
    if (!farm) return 0
    const total = farm.items.reduce((sum, { description, price }) => {
      return description.includes(productName) ? sum : sum + price
    }, 0)
    return total
  }

  const getTotalPriceByFarm = (customers) => {
    return customers.map(({ name, total_price }) => ({
      farm: name,
      total_price,
    }))
  }

  // Main Filtering
  let filteredData = filterByDate(data.customers, filters.from, filters.to)
  filteredData = filterByFarm(filteredData, filters.farm)
  filteredData = filterByProduct(filteredData, filters.product)
  filteredData = filterByQuantity(filteredData, filters.quantity)
  filteredData = filterByPrice(filteredData, filters.price)

  // Risultati per Azione
  const results = {}

  if (actions.includes("GetAllFarms")) {
    results.allFarms = getAllFarms(filteredData, numofElement)
  }
  if (actions.includes("GetAllOrders")) {
    results.allOrders = getAllOrders(filteredData, numofElement)
  }
  if (actions.includes("GetAllProducts")) {
    results.allProducts = getAllProducts(
      filteredData,
      numofElement,
      filters.orderBy
    )
  }
  if (actions.includes("GetOrder")) {
    results.order = getOrder(filteredData, filters.orderId)
  }
  if (actions.includes("GetProduct")) {
    results.product = getProduct(filteredData, filters.product)
  }
  if (actions.includes("GetFarm")) {
    results.farm = getFarm(filteredData, filters.farm)
  }
  if (actions.includes("GetFarmPrice")) {
    results.farmPrice = getFarmPrice(filteredData, filters.farm)
  }
  if (actions.includes("GetTopFarms")) {
    results.topFarms = getTopFarms(filteredData, numofElement)
  }
  if (actions.includes("GetTopProducts")) {
    results.topProducts = getTopProducts(filteredData, numofElement)
  }
  if (actions.includes("GetFarmTotalPriceButRemoveProduct")) {
    results.total = getFarmTotalPriceButRemoveProduct(
      filteredData,
      filters.farm,
      filters.product
    )
  }
  if (actions.includes("GetTotalPriceByFarm")) {
    results.total = getTotalPriceByFarm(filteredData)
  }

  // Fallback
  if (!Object.keys(results).length) {
    return {
      Answer: "No results found for the given filters.",
      results: [],
    }
  }

  return {
    Answer: "Please wait a moment while I retrieve the data.",
    results,
  }
}
