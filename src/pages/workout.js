import React, { useState } from 'react';
import Categories from './categories';  // Make sure this path is correct
import Recommendations from './Recommendations';  // Same for this path

const WorkoutPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      {/* Ensure Categories is inside WorkoutPage */}
      <Categories setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
      {/* Ensure Recommendations is inside WorkoutPage */}
      <Recommendations selectedCategory={selectedCategory} />
    </div>
  );
};

export default WorkoutPage;