import React, {useState, useEffect} from 'react'
import './UserCollection.css'

export default function UserCollection(props) {
  const [star, setStar] = useState(0)

  const showName = (elem) => {
    if (elem.KoreanName != "") {
      return (
        elem.KoreanName
      )
    }
    return (
      elem.PrimaryName
    )
  }

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

  const showCog = () => {
    if (props.isMe) {
    return (
      <i className="fas fa-cog text-info"></i>
    )
    }
  }

  const listItems = props.collection.map((elem, index) =>
    <div className="col-6 col-sm-4 col-md-3 col-lg-2 px-1 py-2" key={index + 1}>
      <div className="h-100 border rounded d-flex flex-column justify-content-center">
        <div className="card-img-div flex-grow-1 d-flex flex-column justify-content-center p-1">
          <img src={elem.Thumbnail} className="card-img rounded-top"/>
        </div>
        <div className="p-2 flex-grow-0">
          <div className="star">
            {showStars(5)}
            <span className="ml-2 text-warning">5</span>
          </div>
          <div className="pt-2 d-flex justify-content-between">
            {showName(elem)}
            {showCog()}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="row pt-2">
        {listItems}
    </div>
  )
}