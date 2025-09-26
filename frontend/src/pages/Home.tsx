import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Headphones, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-laptops.jpg';

// Mock data - will be replaced with real API calls
const featuredProducts = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    price: 2499,
    discountPrice: 2299,
    image: '/api/placeholder/400/300',
    rating: 4.9,
    reviewCount: 128,
  },
  {
    id: '2',
    name: 'Dell XPS 15',
    brand: 'Dell',
    price: 1899,
    image: '/api/placeholder/400/300',
    rating: 4.7,
    reviewCount: 94,
  },
  {
    id: '3',
    name: 'ThinkPad X1 Carbon',
    brand: 'Lenovo',
    price: 1699,
    discountPrice: 1549,
    image: '/api/placeholder/400/300',
    rating: 4.8,
    reviewCount: 156,
  },
];

const features = [
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Carefully selected laptops from top brands with full warranty coverage.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over $999. Express delivery available.',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: '24/7 technical support and professional repair services.',
  },
];

export const Home = () => {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 hero-gradient opacity-90" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              ✨ Premium Laptop Collection
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Laptop
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Discover premium laptops from top brands. Quality guaranteed, 
              expert support included, and fast delivery worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="btn-hero group" asChild>
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="btn-ghost-hero" asChild>
                <Link to="/repair-booking">
                  Repair Service
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SOLEKTA?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best laptop shopping experience 
              with quality products and exceptional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-gradient border-0 slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-muted-foreground">
                Handpicked laptops for every need and budget
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/products">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="card-gradient border-0 overflow-hidden group hover:shadow-lg transition-all duration-300 slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
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
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
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
                    
                    <Button size="sm" asChild>
                      <Link to={`/products/${product.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" asChild>
              <Link to="/products">
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Professional Repair Service?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Our certified technicians provide expert laptop repair services 
              with genuine parts and warranty coverage.
            </p>
            <Button size="lg" variant="outline" className="btn-ghost-hero" asChild>
              <Link to="/repair-booking">
                Book Repair Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};