import React, {useState, useEffect} from 'react'
import './UserCollection.css'

export default function UserCollection(props) {
  const [isLoading, setIsLoading] = useState(false)

  function sendItemImport(geekId) {
    setIsLoading(true)

    let form = new FormData
    form.append("geekId", geekId)

    Axios.post("/item/import", form)
    .then(res => {
      let found = props.collection.find(e => e.Item.ID == geekId)
      found.IsExist = true
      // setCollections(collections)
      setIsLoading(false)
    })
    .catch(err => {
      if (err.response) {
        setError("에러: " + err.response.data.error)
      }
      setIsLoading(false)
    })
  }
  
  let spinner =
  <div className="spinner-border text-success" role="status">
    <span className="sr-only">Loading...</span>
  </div>
  
  function drawItems() {
    let countDisplay
    if (props.collection.length > 0) {
      countDisplay =  <li className="list-group-item" key="0">아이템 개수: {props.collection.length}</li>
    }

    function drawButton(geekId, isExist) {
      if (isLoading) {
        return spinner
      }

      if (isExist) {
        return (
          <h3 className="text-success"><i className="fas fa-check"></i></h3>
        )
      }

      return (
        <div>        
          <div className="mb-1">아직 허브의 DB에 없는 아이템입니다.</div>
          <button type="button" className="btn btn-primary" onClick={() => {sendItemImport(geekId)}}>DB에 추가</button>
        </div>
      )
    }

    function drawStatus(status) {
      let buttons = []
      if (status.Own > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="0">Own</button>)
      } else if (status.PrevOwned > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="1">PrevOwned</button>)
      } else if (status.ForTrade > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="2">ForTrade</button>)
      } else if (status.Want > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="3">Want</button>)
      } else if (status.WantToBuy > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="4">WantToBuy</button>)
      } else if (status.Wishlist > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="5">Wishlist</button>)
      } else if (status.Preordered > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="6">Preordered</button>)
      }
      return buttons
    }

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
          <div className="card-img-div flex-grow-1 d-flex flex-column justify-content-center">
            <img src={elem.Thumbnail} className="card-img rounded-top"/>
          </div>
          <div className="p-2 flex-grow-0">
            <h6 className=""><b>{showName(elem)}</b></h6>
            <p className="">
              {drawStatus(elem.Status)}
            </p>
          </div>
        </div>
      </div>
    )


    return (
      <div className="row">
          {listItems}
      </div>
    )
  }

  return (
      drawItems()
  )
}