import biryaniImg from '@/assets/biryani.jpg';
import karahiImg from '@/assets/karahi.jpg';
import seekhKebabImg from '@/assets/seekh-kebab.jpg';
import burgerImg from '@/assets/burger.jpg';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in PKR
  category: string;
  image: string;
  featured?: boolean;
  sizes?: { name: string; price: number }[]; // For pizza sizes
  pieces?: { count: number; price: number }[]; // For items like chicken fries
}

export const categories = [
  'All',
  'Desi Food',
  'Fast Food',
  'Pizza',
  'Burgers',
  'Drinks'
];

export const products: Product[] = [
  // Desi Food
  {
    id: '1',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with tender chicken, perfectly spiced with traditional herbs and saffron',
    price: 450,
    category: 'Desi Food',
    image: biryaniImg,
    featured: true,
  },
  {
    id: '2',
    name: 'Chicken Karahi',
    description: 'Traditional Pakistani curry with chicken cooked in tomatoes and aromatic spices',
    price: 650,
    category: 'Desi Food',
    image: karahiImg,
    featured: true,
  },
  {
    id: '3',
    name: 'Seekh Kebab',
    description: 'Grilled minced beef kebabs seasoned with Pakistani spices and herbs',
    price: 350,
    category: 'Desi Food',
    image: seekhKebabImg,
  },
  {
    id: '4',
    name: 'Beef Nihari',
    description: 'Slow-cooked beef stew with traditional Pakistani spices, served with naan',
    price: 550,
    category: 'Desi Food',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80',
  },
  {
    id: '5',
    name: 'Mutton Haleem',
    description: 'Rich and creamy lentil stew with tender mutton, garnished with fried onions',
    price: 400,
    category: 'Desi Food',
    image: 'https://images.unsplash.com/photo-1574653853027-5d3b147d3a26?w=800&q=80',
  },
  {
    id: '6',
    name: 'Chapli Kebab',
    description: 'Spicy flat minced meat patties from Peshawar, served with naan and chutney',
    price: 300,
    category: 'Desi Food',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80',
  },

  // Fast Food
  {
    id: '7',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
    price: 380,
    category: 'Burgers',
    image: burgerImg,
    featured: true,
  },
  {
    id: '8',
    name: 'Chicken Shawarma',
    description: 'Tender chicken strips wrapped in fresh bread with garlic sauce and vegetables',
    price: 280,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
  },
  {
    id: '9',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomato sauce, mozzarella cheese, and basil',
    price: 1200,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80',
    sizes: [
      { name: 'Small', price: 800 },
      { name: 'Medium', price: 1200 },
      { name: 'Large', price: 1600 },
      { name: 'Extra Large', price: 2000 }
    ]
  },
  {
    id: '10',
    name: 'Crispy Fried Chicken',
    description: 'Golden crispy chicken pieces seasoned with herbs and spices',
    price: 500,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
    pieces: [
      { count: 6, price: 500 },
      { count: 12, price: 900 },
      { count: 24, price: 1600 }
    ]
  },

  // Snacks - moved to Fast Food
  {
    id: '11',
    name: 'Samosa (2 pieces)',
    description: 'Crispy triangular pastries filled with spiced potatoes and peas',
    price: 80,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
  },
  {
    id: '12',
    name: 'French Fries',
    description: 'Golden crispy potato fries seasoned with salt',
    price: 150,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
  },
  {
    id: '13',
    name: 'Pakora',
    description: 'Mixed vegetable fritters with chickpea flour batter and spices',
    price: 120,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
  },
  {
    id: '14',
    name: 'Golgappa (6 pieces)',
    description: 'Crispy hollow puris filled with spiced water, tamarind, and chickpeas',
    price: 100,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&q=80',
  },

  // Drinks
  {
    id: '15',
    name: 'Desi Chai',
    description: 'Traditional Pakistani tea with milk and aromatic spices',
    price: 60,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
  },
  {
    id: '16',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime juice with soda water and mint',
    price: 120,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
  },
  {
    id: '17',
    name: 'Mango Lassi',
    description: 'Creamy yogurt drink blended with fresh mango pulp',
    price: 180,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=800&q=80',
  },

  // Sweets & Desserts - moved to Fast Food
  {
    id: '18',
    name: 'Jalebi',
    description: 'Crispy spiral-shaped sweet soaked in sugar syrup',
    price: 200,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  },
  {
    id: '19',
    name: 'Chocolate Ice Cream',
    description: 'Rich and creamy chocolate ice cream',
    price: 250,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80',
  },
  {
    id: '20',
    name: 'Halwa Puri',
    description: 'Traditional sweet semolina pudding served with fried bread',
    price: 150,
    category: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  },
];