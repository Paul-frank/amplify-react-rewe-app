import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [sortConfigs, setSortConfigs] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://2v2c6afkzg.execute-api.eu-central-1.amazonaws.com/default/reweApi/products', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const requestSort = (key) => {
    const existingConfig = sortConfigs.find(config => config.key === key);
    if (existingConfig) {
      setSortConfigs(sortConfigs.map(config => {
        if (config.key === key) {
          return { ...config, direction: config.direction === 'ascending' ? 'descending' : 'ascending' };
        }
        return config;
      }));
    } else {
      setSortConfigs([...sortConfigs, { key, direction: 'ascending' }]);
    }
  };

  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...products];
    sortConfigs.forEach(sortConfig => {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    });
    return sortableProducts;
  }, [products, sortConfigs]);


  const getSortIcon = (column) => {
    return sortConfig && sortConfig.key === column ? (sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : null;
  }

  return (
    <Container maxWidth="md">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Produktkatalog
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => requestSort('productName')}>Produktname{getSortIcon('productName')}</TableCell>
                  <TableCell onClick={() => requestSort('energie')}>Energie{getSortIcon('energie')}</TableCell>
                  <TableCell onClick={() => requestSort('fett')}>Fett{getSortIcon('fett')}</TableCell>
                  <TableCell onClick={() => requestSort('gesättigteFettsäuren')}>Gesättigte Fettsäuren{getSortIcon('gesättigteFettsäuren')}</TableCell>
                  <TableCell onClick={() => requestSort('kohlenhydrate')}>Kohlenhydrate{getSortIcon('kohlenhydrate')}</TableCell>
                  <TableCell onClick={() => requestSort('zucker')}>Zucker{getSortIcon('zucker')}</TableCell>
                  <TableCell onClick={() => requestSort('ballaststoffe')}>Ballaststoffe{getSortIcon('ballaststoffe')}</TableCell>
                  <TableCell onClick={() => requestSort('eiweiß')}>Eiweiß{getSortIcon('eiweiß')}</TableCell>
                  <TableCell onClick={() => requestSort('salz')}>Salz{getSortIcon('salz')}</TableCell>
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
  );
}

export default App;
