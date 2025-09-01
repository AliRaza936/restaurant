import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  selectedCategory: { name: string; value: string };
  onCategoryChange: (category: { name: string; value: string }) => void;
  categories: Category[];
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  categories,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {/* All Button */}
      <Button
        variant={selectedCategory.value === 'All' ? 'default' : 'outline'}
        className={
          selectedCategory.value === 'All'
            ? 'bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium transition-smooth shadow-primary'
            : 'border-border hover:border-primary hover:bg-surface-elevated text-foreground transition-smooth'
        }
        onClick={() => onCategoryChange({ name: 'All', value: 'All' })}
      >
        All
      </Button>

      {/* Dynamic Categories */}
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory.value === category.id ? 'default' : 'outline'}
          onClick={() => onCategoryChange({ name: category.name, value: category.id })}
          className={
            selectedCategory.value === category.id
              ? 'bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium transition-smooth shadow-primary'
              : 'border-border hover:border-primary hover:bg-surface-elevated text-foreground transition-smooth'
          }
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};
