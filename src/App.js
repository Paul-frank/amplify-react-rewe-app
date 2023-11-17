import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState(null);

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

  const sortedProducts = React.useMemo(() => {
    let sortableProducts = [...products];
    if (sortConfig !== null) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
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
                  <TableCell onClick={() => requestSort('productName')}>Produktname</TableCell>
                  <TableCell onClick={() => requestSort('energie')}>Energie</TableCell>
                  <TableCell onClick={() => requestSort('fett')}>Fett</TableCell>
                  <TableCell onClick={() => requestSort('gesättigteFettsäuren')}>Gesättigte Fettsäuren</TableCell>
                  <TableCell onClick={() => requestSort('kohlenhydrate')}>Kohlenhydrate</TableCell>
                  <TableCell onClick={() => requestSort('zucker')}>Zucker</TableCell>
                  <TableCell onClick={() => requestSort('ballaststoffe')}>Ballaststoffe</TableCell>
                  <TableCell onClick={() => requestSort('eiweiß')}>Eiweiß</TableCell>
                  <TableCell onClick={() => requestSort('salz')}>Salz</TableCell>
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
