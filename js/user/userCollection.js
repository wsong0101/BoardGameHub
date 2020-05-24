import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Util from '../util/util'
import './UserCollection.css'
import ItemScore from './itemScore'
import CollectionEditModal from './collectionEditModal'

export default function UserCollection(props) {
  const [select, setSelect] = useState({})

  const showEditModal = (elem) => {
    setSelect(elem)
    $('.editModal').modal('show')
  }

  const showCog = (elem) => {
    if (props.isMe) {
      return (
        <i className="fas fa-cog text-info hand" onClick={() => {showEditModal(elem)}}></i>
      )
    }
  }

  const drawlistItems = () => {
    return (
        props.collection.map((elem, index) =>
        <div className="col-6 col-sm-4 col-md-3 col-lg-2 px-1 py-2" key={index + 1}>
          <div className="h-100 border rounded d-flex flex-column justify-content-center">
            <div className="card-img-div flex-grow-1 d-flex flex-column justify-content-center p-1">
              <Link to={"/item/info/"+elem.ID} className="card-img">
                <img src={elem.Thumbnail} className="card-img rounded-top"/>
              </Link>
            </div>
            <div className="p-2 flex-grow-0">
              <div className="star">
                <ItemScore score={elem.Score} />
              </div>
              <div className="pt-2 d-flex justify-content-between">
                {Util.getName(elem)}
                {showCog(elem)}
              </div>
            </div>
          </div>
        </div>
      )
    )
  }

  return (
    <div className="row pt-2">
        {drawlistItems()}
        <CollectionEditModal updateCollection={props.updateCollection} updateErr={props.updateErr} collection={select}/>
    </div>
  )
}