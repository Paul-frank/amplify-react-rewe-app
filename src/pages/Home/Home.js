import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Chip from "@mui/material/Chip";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [sortConfigs, setSortConfigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positiveFilters, setPositiveFilters] = useState([]);
  const [negativeFilters, setNegativeFilters] = useState([]);
  const [positiveFilterInput, setPositiveFilterInput] = useState("");
  const [negativeFilterInput, setNegativeFilterInput] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState({
    mainCategories: ["Getränke", "Lebensmittel"],
    subCategories: {
      Getränke: ["Wasser", "Saft"],
      Lebensmittel: ["Brot", "Fleisch"],
    },
  });
  const pageSize = 50; // Anzahl der Produkte pro Seite
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://rewefunction.azurewebsites.net/api/http-rewe-api",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setProducts(response.data);
        setDisplayedProducts(response.data.slice(0, pageSize));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const sortedDisplayedProducts = React.useMemo(() => {
    return [...displayedProducts].sort((a, b) => {
      for (let i = sortConfigs.length - 1; i >= 0; i--) {
        const config = sortConfigs[i];
        if (a[config.key] !== b[config.key]) {
          return config.direction === "ascending"
            ? a[config.key] < b[config.key]
              ? -1
              : 1
            : a[config.key] > b[config.key]
            ? -1
            : 1;
        }
      }
      return 0;
    });
  }, [displayedProducts, sortConfigs]);

  const applyFilters = (productsList) => {
    return productsList.filter((product) => {
      const ingredients = product.ingredientStatement.toLowerCase();
      const meetsPositiveFilters = positiveFilters.every((filter) =>
        ingredients.includes(filter.toLowerCase())
      );
      const meetsNegativeFilters = negativeFilters.every(
        (filter) => !ingredients.includes(filter.toLowerCase())
      );
      return (
        meetsPositiveFilters &&
        meetsNegativeFilters &&
        product.productName.toLowerCase().includes(searchTerm)
      );
    });
  };

  const filteredDisplayedProductsChips = React.useMemo(() => {
    return sortedDisplayedProducts.filter((product) => {
      const ingredients = product.ingredientStatement.toLowerCase();

      const meetsPositiveFilters = positiveFilters.every((filter) =>
        ingredients.includes(filter.toLowerCase())
      );

      const meetsNegativeFilters = negativeFilters.every(
        (filter) => !ingredients.includes(filter.toLowerCase())
      );

      return (
        meetsPositiveFilters &&
        meetsNegativeFilters &&
        product.productName.toLowerCase().includes(searchTerm)
      );
    });
  }, [sortedDisplayedProducts, positiveFilters, negativeFilters, searchTerm]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 5) {
      loadMoreProducts();
    }
  };

  const requestSort = (key) => {
    const existingConfig = sortConfigs.find((config) => config.key === key);
    if (existingConfig) {
      if (existingConfig.direction === "descending") {
        setSortConfigs(
          sortConfigs.map((config) =>
            config.key === key ? { ...config, direction: "ascending" } : config
          )
        );
      } else {
        setSortConfigs(sortConfigs.filter((config) => config.key !== key));
      }
    } else {
      setSortConfigs([...sortConfigs, { key, direction: "descending" }]);
    }
  };

  const sortedProducts = React.useMemo(() => {
    return [...products].sort((a, b) => {
      for (let i = sortConfigs.length - 1; i >= 0; i--) {
        const config = sortConfigs[i];
        if (a[config.key] !== b[config.key]) {
          return config.direction === "ascending"
            ? a[config.key] < b[config.key]
              ? -1
              : 1
            : a[config.key] > b[config.key]
            ? -1
            : 1;
        }
      }
      return 0;
    });
  }, [products, sortConfigs]);

  const getSortIcon = (column) => {
    const sortConfig = sortConfigs.find((config) => config.key === column);
    return sortConfig ? (
      sortConfig.direction === "ascending" ? (
        <ArrowUpwardIcon />
      ) : (
        <ArrowDownwardIcon />
      )
    ) : null;
  };

  const handleRemovePositiveFilter = (filter) => {
    setPositiveFilters(positiveFilters.filter((f) => f !== filter));
  };

  const handleRemoveNegativeFilter = (filter) => {
    setNegativeFilters(negativeFilters.filter((f) => f !== filter));
  };

  // Funktion, die auf Änderungen im Suchfeld reagiert
  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    setCurrentPage(1); // Setzen Sie currentPage hier zurück

    if (searchTerm) {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm)
      );
      setSearchResults(filtered.slice(0, 50));
    } else {
      setSearchResults([]);
      setDisplayedProducts(products.slice(0, pageSize));
    }
  };

  const loadMoreProducts = () => {
    const startIndex = pageSize * currentPage;
    const endIndex = startIndex + pageSize;
    const newProducts = filterProducts(products.slice(startIndex, endIndex));

    if (newProducts.length > 0) {
      setDisplayedProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setCurrentPage(currentPage + 1);
    }
  };

  // Filtern der Produkte basierend auf dem Suchbegriff
  const filteredProducts = sortedProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm)
  );

  // Filtern der Produkte basierend auf positiven und negativen Filtern
  const filteredProductsChips = React.useMemo(() => {
    return sortedProducts.filter((product) => {
      const ingredients = product.ingredientStatement.toLowerCase();

      const meetsPositiveFilters = positiveFilters.every((filter) =>
        ingredients.includes(filter.toLowerCase())
      );

      const meetsNegativeFilters = negativeFilters.every(
        (filter) => !ingredients.includes(filter.toLowerCase())
      );

      return (
        meetsPositiveFilters &&
        meetsNegativeFilters &&
        product.productName.toLowerCase().includes(searchTerm)
      );
    });
  }, [sortedProducts, positiveFilters, negativeFilters, searchTerm]);

  // Funktion zum Anwenden der Filter auf die Produktdaten
  const filterProducts = (productsToFilter) => {
    return productsToFilter.filter((product) => {
      const ingredients = product.ingredientStatement.toLowerCase();

      const meetsPositiveFilters =
        positiveFilters.length === 0 ||
        positiveFilters.every((filter) =>
          ingredients.includes(filter.toLowerCase())
        );

      const meetsNegativeFilters =
        negativeFilters.length === 0 ||
        negativeFilters.every(
          (filter) => !ingredients.includes(filter.toLowerCase())
        );

      return meetsPositiveFilters && meetsNegativeFilters;
    });
  };

  // Funktion, die auf Änderungen im Eingabefeld für den positiven Filter reagiert
  const handlePositiveFilterInputChange = (event) => {
    setPositiveFilterInput(event.target.value);
  };

  // Funktion zum Hinzufügen des positiven Filters
  const handleAddPositiveFilter = () => {
    if (positiveFilterInput) {
      setPositiveFilters([...positiveFilters, positiveFilterInput]);
      setPositiveFilterInput(""); // Eingabefeld leeren
    }
  };

  // Funktion zum Hinzufügen des negativen Filters
  const handleAddNegativeFilter = () => {
    if (negativeFilterInput) {
      setNegativeFilters([...negativeFilters, negativeFilterInput]);
      setNegativeFilterInput(""); // Eingabefeld leeren
    }
  };

  // Funktion, die auf Änderungen im Eingabefeld für den negativen Filter reagiert
  const handleNegativeFilterInputChange = (event) => {
    setNegativeFilterInput(event.target.value);
  };

  const displayedProductsMemo = React.useMemo(() => {
    let productsToShow = searchTerm ? searchResults : products;
    productsToShow = filterProducts(productsToShow);

    return productsToShow.slice(0, pageSize * currentPage);
  }, [
    products,
    searchResults,
    searchTerm,
    currentPage,
    positiveFilters,
    negativeFilters,
  ]);

  return (
    <div className="main-content">
      <Container maxWidth="">
        <Box my={4} className="contentWrapper" onScroll={handleScroll}>
          <Typography variant="h4" component="h1" gutterBottom>
            Produktkatalog
          </Typography>
          <TextField
            label="Produkt suchen"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleSearchChange}
          />
          <Box display="flex" justifyContent="space-between" my={2}>
            <FormControl style={{ marginRight: "10px", flex: 1 }}>
              <InputLabel id="main-category-label">Hauptkategorie</InputLabel>
              <Select
                labelId="main-category-label"
                id="main-category-select"
                value={mainCategory}
                label="Hauptkategorie"
                onChange={(event) => {
                  setMainCategory(event.target.value);
                  if (event.target.value === "") {
                    setSubCategory(""); // Setzt auch subCategory zurück, wenn "Keine Auswahl" gewählt wird
                  }
                }}
              >
                <MenuItem value="">Keine Auswahl</MenuItem>
                {categoryOptions.mainCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ flex: 1 }}>
              <InputLabel id="sub-category-label">Nebenkategorie</InputLabel>
              <Select
                labelId="sub-category-label"
                id="sub-category-select"
                value={subCategory}
                label="Nebenkategorie"
                onChange={(event) => setSubCategory(event.target.value)}
                disabled={!mainCategory}
              >
                {mainCategory &&
                  categoryOptions.subCategories[mainCategory].map((sub) => (
                    <MenuItem key={sub} value={sub}>
                      {sub}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="space-between" my={2}>
            <TextField
              label="Positiven Filter hinzufügen"
              variant="outlined"
              margin="normal"
              value={positiveFilterInput}
              onChange={handlePositiveFilterInputChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleAddPositiveFilter();
                }
              }}
              style={{ marginRight: "10px", flex: 1 }}
            />
            <TextField
              label="Negativen Filter hinzufügen"
              variant="outlined"
              margin="normal"
              value={negativeFilterInput}
              onChange={handleNegativeFilterInputChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleAddNegativeFilter();
                }
              }}
              style={{ flex: 1 }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
                maxWidth: "50%",
              }}
            >
              {positiveFilters.map((filter, index) => (
                <Chip
                  key={index}
                  label={filter}
                  onDelete={() => handleRemovePositiveFilter(filter)}
                  color="primary"
                />
              ))}
            </Box>
            <Box
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
                maxWidth: "50%",
              }}
            >
              {negativeFilters.map((filter, index) => (
                <Chip
                  key={index}
                  label={filter}
                  onDelete={() => handleRemoveNegativeFilter(filter)}
                  color="secondary"
                />
              ))}
            </Box>
          </Box>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("productName")}
                    >
                      Produktname{getSortIcon("productName")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("energie_kcal")}
                    >
                      Energie(kcal){getSortIcon("energie_kcal")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("kohlenhydrate_gramm")}
                    >
                      Kohlenhydrate(g){getSortIcon("kohlenhydrate_gramm")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("sugar_gramm")}
                    >
                      Zucker(g){getSortIcon("sugar_gramm")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("fett_gramm")}
                    >
                      Fett(g){getSortIcon("fett_gramm")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("eiweiß_gramm")}
                    >
                      Eiweiß(g){getSortIcon("eiweiß_gramm")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("ingredientStatement")}
                    >
                      Inhaltsstoffe
                      {getSortIcon("ingredientStatement")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedProductsMemo.map((product) => (
                    <TableRow key={product.product_Id}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.energie_kcal}</TableCell>
                      <TableCell>{product.kohlenhydrate_gramm}</TableCell>
                      <TableCell>{product.sugar_gramm}</TableCell>
                      <TableCell>{product.fett_gramm}</TableCell>
                      <TableCell>{product.eiweiß_gramm}</TableCell>
                      <TableCell>{product.ingredientStatement}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
    </div>
  );
};
export default Home;
