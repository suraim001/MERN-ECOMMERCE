import React, { useState } from 'react';
import '../componentStyles/Rating.css';
import { selectClasses } from '@mui/material/Select';

const Rating = ({ value, onRatingChange, disabled }) => {

    const [hoveredRating, setHoveredRating] = useState(0);
    const [seletedRating, setSelectedRating] = useState(value || 0)

    // Handle Star Hover
    const handleMouseEnter = (rating) => {
        if (!disabled) setHoveredRating(rating)
    }

    // Mouse Leave
    const handleMouseLeave = () => {
        if (!disabled) setHoveredRating(0);
    }

    // Handle Click
    const handleClick = (rating) => {
        if (!disabled) {
            setSelectedRating(rating);
            if (onRatingChange) onRatingChange(rating);
        }
    }

    // Function to generate stars based on the selected rating
    const generateStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= (hoveredRating || seletedRating);
            stars.push(
                <span
                    key={i}
                    className={`star ${isFilled ? 'filled' : 'empty'}`}
                    onMouseEnter={() => handleMouseEnter}
                    onMouseLeave={() => handleMouseLeave}
                    onClick={() => handleClick}
                    style={{ pointerEvents: disabled ? 'none' : 'auto' }}>
                    🟊
                </span>
            )
        }
        return stars;
    }


    return (
        <div>
            <div className="rating"> {generateStars()}</div>
        </div>
    )
}

export default Rating
