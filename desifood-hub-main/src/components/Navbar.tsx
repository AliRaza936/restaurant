import { useState } from 'react';
import { ShoppingCart, Menu, X, User, LogOut, Heart, History, Settings, Shield, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onSearch: (query: string) => void;
}

export const Navbar = ({ onSearch }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

   const { items } = useAppSelector(state => state.cart);
  const { count: favoritesCount } = useAppSelector(state => state.favorites);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface-elevated border-b border-border backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl shadow-glow flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">SP</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">Spice Palace</h1>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-white h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for delicious food..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-10 bg-surface-container text-white border-border focus:border-primary"
              />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-surface-elevated">
                    <User className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="flex items-center cursor-pointer">
                      <Heart className="mr-2 h-4 w-4 text-white" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/order-history" className="flex items-center cursor-pointer">
                      <History className="mr-2 h-4 w-4 text-white" />
                      <span>Order History</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 text-white" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' || user.role === 'user' ? (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="flex items-center cursor-pointer">
                        <Shield className="mr-2 h-4 w-4 text-white" />
                        <span>{user.role === 'user' ? 'Admin panel (Testing)' : 'Admin Panel'}</span>
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4 text-white" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-surface-elevated text-white">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            <Link to="/favorites">
              <Button variant="outline" size="icon" className="relative border-border hover:border-primary">
                <Heart className="h-5 w-5 text-white" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" size="icon" className="relative border-border hover:border-primary">
                <ShoppingCart className="h-5 w-5 text-white" />
                {items?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items?.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
              <SearchIcon className="h-5 w-5 text-white" />
            </Button>
            <Button variant="ghost" size="icon" className='text-white' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <form onSubmit={handleSearch} className="md:hidden my-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for delicious food..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-10 text-white bg-surface-container border-border focus:border-primary"
              />
            </div>
          </form>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-2">
            {user ? (
              <>
                <Link to="/favorites" className="block">
                  <Button variant="outline" className="w-full text-white justify-start">
                    <Heart className="h-5 w-5 mr-2 text-white" />
                    Favorites {favoritesCount > 0 && `(${favoritesCount})`}
                  </Button>
                </Link>
                <Link to="/order-history" className="block">
                  <Button variant="outline" className="w-full text-white justify-start">
                    <History className="h-5 w-5 mr-2 text-white" />
                    Order History
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full text-white justify-start">
                    <Settings className="h-5 w-5 mr-2 text-white" />
                    Profile Settings
                  </Button>
                </Link>
                {(user.role === 'admin' || user.role === 'user') && (
                  <Link to="/admin/dashboard" className="block">
                    <Button variant="outline" className="w-full text-white justify-start">
                      <Shield className="h-5 w-5 mr-2 text-white" />
                      <span>{user.role === 'user' ? 'Admin panel (Testing)' : 'Admin Panel'}</span>
                    </Button>
                  </Link>
                )}
                <Button onClick={handleSignOut} variant="outline" className="w-full justify-start text-red-600">
                  <LogOut className="h-5 w-5 mr-2 text-white" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full justify-start text-white">
                    <User className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button className="w-full bg-gradient-primary text-primary-foreground">Sign Up</Button>
                </Link>
              </>
            )}
            <Link to="/cart" className="block">
              <Button variant="outline" className="w-full justify-start text-white">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({items?.length})
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
