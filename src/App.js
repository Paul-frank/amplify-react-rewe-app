import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Box, CircularProgress, List, ListItem, ListItemText, Divider, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar} from '@mui/material';

function App() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    price: "",
    calories: "",
    ingredients: "",
  });
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [productId]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://2v2c6afkzg.execute-api.eu-central-1.amazonaws.com/default/reweApi/products', {
        headers: {
          'Content-Type': 'application/json',
        },
        params: { id: productId },
      });
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Box my={4} textAlign="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Produktkatalog
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="stretch" gap={2} my={2}>
            <TextField
              id="product-id"
              label="Produkt-ID"
              variant="outlined"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              style={{ flexBasis: '150px' }}
            />
            {/* Weitere Steuerelemente und Aktionen für Produktfunktionen hier */}
          </Box>
  
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </React.Fragment>
  );
  
}

export default App;
