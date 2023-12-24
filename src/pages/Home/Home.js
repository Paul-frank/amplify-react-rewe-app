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
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [sortConfigs, setSortConfigs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Neuer State für den Suchbegriff

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://2v2c6afkzg.execute-api.eu-central-1.amazonaws.com/default/reweApi/products",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

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

  // Funktion, die auf Änderungen im Suchfeld reagiert
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filtern der Produkte basierend auf dem Suchbegriff
  const filteredProducts = sortedProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="main-content">
      <Container maxWidth="">
        <Box my={4} className="contentWrapper">
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
                      onClick={() => requestSort("energie")}
                    >
                      Energie{getSortIcon("energie")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("fett")}
                    >
                      Fett{getSortIcon("fett")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("gesättigteFettsäuren")}
                    >
                      Gesättigte Fettsäuren{getSortIcon("gesättigteFettsäuren")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("kohlenhydrate")}
                    >
                      Kohlenhydrate{getSortIcon("kohlenhydrate")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("zucker")}
                    >
                      Zucker{getSortIcon("zucker")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("ballaststoffe")}
                    >
                      Ballaststoffe{getSortIcon("ballaststoffe")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("eiweiß")}
                    >
                      Eiweiß{getSortIcon("eiweiß")}
                    </TableCell>
                    <TableCell
                      className="tableHeaderCell"
                      onClick={() => requestSort("salz")}
                    >
                      Salz{getSortIcon("salz")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProducts.map((product) => (
                    <TableRow key={product.productID}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.energie}</TableCell>
                      <TableCell>{product.fett}</TableCell>
                      <TableCell>{product.gesättigteFettsäuren}</TableCell>
                      <TableCell>{product.kohlenhydrate}</TableCell>
                      <TableCell>{product.zucker}</TableCell>
                      <TableCell>{product.ballaststoffe}</TableCell>
                      <TableCell>{product.eiweiß}</TableCell>
                      <TableCell>{product.salz}</TableCell>
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
