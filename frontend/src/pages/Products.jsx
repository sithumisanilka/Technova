import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, Grid, List, Star, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { productService } from "@/services/productService";

const brands = ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Microsoft"];
const categories = ["Gaming", "Business", "Premium", "Budget"];

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "popularity";

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await productService.getProducts();
        console.log("✅ Products loaded:", productsData);
        setProducts(productsData);
      } catch (err) {
        console.error("❌ Error loading products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleBrandChange = (brand, checked) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value);
    setSearchParams(newParams);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesCategory =
      selectedCategories.length === 0 ||
      (product.category &&
        selectedCategories.includes(product.category.categoryName));
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-20"
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-24"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) =>
                  handleBrandChange(brand, checked)
                }
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category, checked)
                }
              />
              <Label htmlFor={`category-${category}`} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-600">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} products found
        </p>
        <div className="mt-2 text-sm text-green-600">
          Debug: Products loaded successfully! Total: {products.length},
          Filtered: {filteredProducts.length}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="card-gradient border-0">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">Filters</h2>
              <FilterContent />
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
              <Card
                key={product.productId}
                className="card-gradient border-0 overflow-hidden group hover:shadow-lg transition-all duration-300 slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`${viewMode === "list" ? "flex" : ""}`}>
                  <div
                    className={`${
                      viewMode === "list" ? "w-64" : "aspect-video"
                    } bg-muted relative overflow-hidden`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        Product Image
                      </span>
                    </div>
                  </div>

                  <CardContent
                    className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {product.brand}
                      </Badge>
                      {product.category && (
                        <Badge variant="secondary" className="text-xs">
                          {product.category.categoryName}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                      <Link to={`/products/${product.productId}`}>
                        {product.name}
                      </Link>
                    </h3>

                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">
                          ${product.price}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => addItem(product)}
                          disabled={product.quantity === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.quantity === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </Button>
                      </div>
                    </div>

                    {product.quantity <= 5 && product.quantity > 0 && (
                      <p className="text-warning text-sm mt-2">
                        Only {product.quantity} left in stock!
                      </p>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))
            ) : null}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedCategories([]);
                  setPriceRange([0, 300000]);
                  setSearchParams({});
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
