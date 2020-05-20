import React, {useState, useEffect} from 'react'

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

    const listItems = props.collection.map((elem, index) =>
      <li className="list-group-item" key={index + 1}>
        <div className="container">
          <div className="row">
            <div className="col-sm-1">{index + 1}</div>
            <div className="col-sm-2"><img src={elem.Thumbnail} className="img-thumbnail"/></div>
            <div className="col-sm-2">{elem.PrimaryName}</div>
            <div className="col-sm-4">
              {drawStatus(elem.Status)}
            </div>
            <div className="col-sm-3">{drawButton(elem.ID, elem.IsExistInDB)}</div>
          </div>
        </div>
      </li>
    )

    return (
      <ul className="list-group mt-3">
        {countDisplay}
        {listItems}
      </ul>
    )
  }

  return (
      drawItems()
  )
}