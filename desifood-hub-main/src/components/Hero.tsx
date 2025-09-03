import heroImage from '@/assets/hero-food.jpg';

export const Hero = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 leading-tight">
          Exquisite 
          <span className="block text-transparent bg-gradient-primary bg-clip-text drop-shadow-lg">
            Delicious Fast Food, Served Fresh & Hot
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-0 max-w-2xl mx-auto leading-relaxed">
         Freshly cooked fast food,made with love and served with speed.
        </p>
      </div>
    </section>
  );
};
