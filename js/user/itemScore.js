import React from 'react'

export default function ItemScore(props) {
  const showStars = (score) => {
    let stars = []
    
    let i = 0
    for (; i < Math.floor(score / 2); ++i) {
      stars.push(
        <i key={i} className="fas fa-star text-warning"></i>
      )
    }

    if (score % 2 == 1) {
      stars.push(
        <i key={i} className="fas fa-star-half text-warning"></i>
      )
    }

    return (
      stars
    )
  }
  
  return (
    <div>      
      <span className="mr-2 text-warning">{props.score}</span>
      {showStars(props.score)}
    </div>
  )
}