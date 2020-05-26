import React, { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { userActions } from '../action'
import { inputRules } from '../common'
import { Util } from '../util'
import ItemScore from './ItemScore'
import CollectionEditModal from './CollectionEditModal'

import { Row, Col, Card, Rate, Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined, StarFilled } from '@ant-design/icons'
import './CollectionPage.css'

function CollectionPage({match}) {
    const auth = useSelector(state => state.get('authentication'))
    const collection = useSelector(state => state.get('collection'))

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(userActions.getCollection(match.params.id, match.params.category, 1))
    }, [])

    const showModal = (e) => {
        dispatch(userActions.showModal(e))
    }

    let items = []
    if (collection.get('collection')) {
        for (const e of collection.get('collection')) {
            let cog
            if (auth.get('loggedIn') && auth.get('user').get('id') == match.params.id) {
                cog = <i className="fas fa-cog text-info hand" onClick={() => {showModal(e)}}></i>
            }

            items.push(         
                <Col key={e.ID} xl={{span: 3}} lg={{span: 4}} md={{span: 6}} xs={{span: 12}}>
                    <div className="h-100 border rounded d-flex flex-column justify-content-center">
                        <div className="card-img-div flex-grow-1 d-flex flex-column justify-content-center p-1">
                            <Link to={"/item/info/"+e.ID} className="card-img">
                                <img src={e.Thumbnail} className="card-img rounded-top"/>
                            </Link>
                        </div>
                        <div className="p-2 flex-grow-0">
                            <div>
                                <ItemScore score={e.Score} />
                            </div>
                            <div className="pt-2 d-flex justify-content-between">
                                {Util.getName(e)}
                                {cog}
                            </div>
                        </div>
                    </div>
                </Col>
            )
        }
    }

    return (
        <div>
            <Row gutter={[12, 12]}>
                {items}
            </Row>
            <CollectionEditModal />
        </div>
    )
}

export { CollectionPage }