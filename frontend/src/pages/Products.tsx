import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productApi } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Search, Star, ShoppingCart, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  description: string;
  category: string;
  sku: string;
  stock: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}

export const Products: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, categoryFilter, sortBy]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      // Mock products for now - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'MacBook Pro 16"',
          brand: 'Apple',
          price: 2499,
          discountPrice: 2299,
          description: 'Powerful laptop with M2 Pro chip, perfect for professionals',
          category: 'Laptop',
          sku: 'MBP16-M2',
          stock: 5,
          rating: 4.9,
          reviewCount: 128
        },
        {
          id: 2,
          name: 'Dell XPS 15',
          brand: 'Dell',
          price: 1899,
          description: 'Premium ultrabook with stunning display and performance',
          category: 'Laptop',
          sku: 'DXP15-2024',
          stock: 8,
          rating: 4.7,
          reviewCount: 94
        },
        {
          id: 3,
          name: 'ThinkPad X1 Carbon',
          brand: 'Lenovo',
          price: 1699,
          discountPrice: 1549,
          description: 'Business laptop with exceptional build quality',
          category: 'Laptop',
          sku: 'TXC1-G10',
          stock: 12,
          rating: 4.8,
          reviewCount: 156
        },
        {
          id: 4,
          name: 'ASUS ROG Strix G15',
          brand: 'ASUS',
          price: 1299,
          description: 'Gaming laptop with RTX 4060 and high refresh rate display',
          category: 'Gaming',
          sku: 'ASG15-RTX',
          stock: 6,
          rating: 4.6,
          reviewCount: 89
        },
        {
          id: 5,
          name: 'HP Pavilion 15',
          brand: 'HP',
          price: 799,
          description: 'Affordable laptop for everyday computing needs',
          category: 'Budget',
          sku: 'HPP15-2024',
          stock: 15,
          rating: 4.3,
          reviewCount: 67
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        case 'price-high':
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  const categories = ['ALL', 'Laptop', 'Gaming', 'Budget'];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Laptop Collection</h1>
        <p className="text-gray-600">Find the perfect laptop for your needs</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search laptops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted relative overflow-hidden">
              {product.discountPrice && (
                <Badge className="absolute top-3 left-3 z-10 bg-destructive">
                  Save ${product.price - product.discountPrice}
                </Badge>
              )}
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Product Image</span>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.brand}
                </Badge>
                {product.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mb-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-2xl font-bold text-primary">
                        ${product.discountPrice}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">
                      ${product.price}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Stock: {product.stock}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/products/${product.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
