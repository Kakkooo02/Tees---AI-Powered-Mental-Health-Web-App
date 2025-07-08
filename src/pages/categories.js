import React from 'react';
import '../styles/categories.css'; // Ensure the CSS file is correctly linked

const Categories = ({ setSelectedCategory, selectedCategory }) => {
  const categories = [
    { name: 'Stretching', id: 1 },
    { name: 'Breathing', id: 2 },
    { name: 'Meditation', id: 3 },
    { name: 'Cardio', id: 4 },
    { name: 'Strength Training', id: 5 },
    { name: 'Yoga', id: 6 },
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="categories-container">
      <div className="categories-wrapper">
        <div className="categories-header">
          <div className="categories-buttons">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`glowonhover ${selectedCategory === null ? 'glow-selected' : ''}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`glowonhover ${selectedCategory === category.id ? 'glow-selected' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
