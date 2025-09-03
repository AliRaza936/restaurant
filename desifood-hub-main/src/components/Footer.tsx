import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
<<<<<<< HEAD
            <h3 className="text-2xl font-bold text-orange-500">Spice Palace Hub</h3>
=======
            <h3 className="text-2xl font-bold text-orange-500">Spice Palace</h3>
>>>>>>> 958f01cc00a47b67ee9e1c8391ec5d4b725f217a
            <p className="text-gray-300 text-sm leading-relaxed">
              Bringing authentic Pakistani cuisine to your doorstep. Experience the rich flavors 
              and traditional recipes that make our food special.
            </p>
            
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Faisalabad, Pakistan
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                +92 300 0000000
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                aliraza93644@gmail.com
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
<<<<<<< HEAD
          © 2025 Spice Palace Hub. Made with <Heart className="h-4 w-4 text-red-500 inline mx-1" /> in Pakistan
=======
          © 2025 Spice palace Hub. Made with <Heart className="h-4 w-4 text-red-500 inline mx-1" /> in Pakistan
>>>>>>> 958f01cc00a47b67ee9e1c8391ec5d4b725f217a
        </div>
      </div>
    </footer>
  );
};

export default Footer;
