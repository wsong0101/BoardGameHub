import React, {useState, useEffect} from 'react'
import './UserCollection.css'

export default function UserCollection(props) {
  function drawItems() {
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

    const listItems = props.collection.map((elem, index) =>
      <div className="col-6 col-sm-4 col-md-3 col-lg-2 px-1 py-2" key={index + 1}>
        <div className="h-100 border rounded d-flex flex-column justify-content-center">
          <div className="card-img-div flex-grow-1 d-flex flex-column justify-content-center p-1">
            <img src={elem.Thumbnail} className="card-img rounded-top"/>
          </div>
          <div className="p-2 flex-grow-0">
            <div className="star">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <span className="ml-2">0</span>
            </div>
            <div className="pt-2">{showName(elem)}</div>
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

  return (
      drawItems()
  )
}