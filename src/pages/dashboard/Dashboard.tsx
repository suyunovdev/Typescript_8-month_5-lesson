import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

// Define the structure of the product data
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  level: string;
  image: string;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error: Error) => {
        console.error("Error fetching data:", error.message);
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Group products by level
  const levels = products.reduce((acc, product) => {
    acc[product.level] = (acc[product.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {Object.keys(levels).map(level => (
          <Grid item xs={12} md={4} lg={3} key={level}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Typography variant="h6" gutterBottom>
                Level: {level}
              </Typography>
              <CircularProgress
                variant="determinate"
                value={(levels[level] / products.length) * 100}
              />
              <Typography variant="caption" display="block" gutterBottom>
                {levels[level]} Products
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
