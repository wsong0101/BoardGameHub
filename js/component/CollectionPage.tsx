import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { itemActions } from '../action'
import { Util } from '../util'
import ItemScore from './ItemScore'
import CollectionEditModal from './CollectionEditModal'

import { Row, Col, Radio, Spin } from 'antd'
import './CollectionPage.css'
import { RootState } from '../reducer'
import { ICollection } from '../common'

function CollectionPage({match}: any) {
    const auth = useSelector((state: RootState) => state.auth)
    const collection = useSelector((state: RootState) => state.collection)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(itemActions.getCollection(match.params.id, match.params.category, match.params.page))
    }, [match.params.category])

    const showModal = (e: ICollection) => {
        dispatch(itemActions.showModal(e))
    }

    let items = []
    if (collection.gettingCollection) {
        items.push(
            <Spin key="0" size="large" />
        )
    } else if (collection.collection) {
        for (const e of collection.collection) {
            let cog
            if (auth.loggedIn && auth.user.ID == match.params.id) {
                cog = <i className="fas fa-cog text-info hand ml-2" onClick={() => {showModal(e)}}></i>
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
                                {cog}
                            </div>
                            <div className="pt-2 d-flex justify-content-between">
                                {Util.getName(e)}
                            </div>
                        </div>
                    </div>
                </Col>
            )
        }
    }

    return (
        <div>
            <Radio.Group value={match.params.category} style={{ marginBottom: '30px' }}>
                <Radio.Button value="own">
                    <Link to={`/user/collection/${match.params.id}/own/1`}>보유중</Link>
                </Radio.Button>
                <Radio.Button value="prev_owned">
                    <Link to={`/user/collection/${match.params.id}/prev_owned/1`}>이전에 보유</Link>
                </Radio.Button>
                <Radio.Button value="for_trade">
                    <Link to={`/user/collection/${match.params.id}/for_trade/1`}>판매중</Link>
                </Radio.Button>
                <Radio.Button value="want">
                    <Link to={`/user/collection/${match.params.id}/want/1`}>갖고싶음</Link>
                </Radio.Button>
                <Radio.Button value="want_to_buy">
                    <Link to={`/user/collection/${match.params.id}/want_to_buy/1`}>구매중</Link>
                </Radio.Button>
                <Radio.Button value="wishlist">
                    <Link to={`/user/collection/${match.params.id}/wishlist/1`}>위시리스트</Link>
                </Radio.Button>
                <Radio.Button value="preordered">
                    <Link to={`/user/collection/${match.params.id}/preordered/1`}>사전주문</Link>
                </Radio.Button>
            </Radio.Group>
            <Row gutter={[12, 12]}>
                {items}
            </Row>
            <CollectionEditModal />
        </div>
    )
}

export { CollectionPage }