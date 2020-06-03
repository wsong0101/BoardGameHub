import React from 'react'

type Score = {
  score: number
}

export default function ItemScore({score}: Score) {
  function showStars (score: number) {
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
    <span>      
      <span className="mr-2 text-warning">{score}</span>
      {showStars(score)}
    </span>
  )
}