import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

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

  return (
    <Container maxWidth="md">
      <Box my={4} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Produktkatalog
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <List>
            {products.map((product) => (
              <React.Fragment key={product.productID}>
                <ListItem>
                  <ListItemText
                    primary={`${product.productName} - €${product.price}`}
                    secondary={`Kalorien: ${product.calories}, Zutaten: ${product.ingredients}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

export default App;
