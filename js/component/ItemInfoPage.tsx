import React, { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { itemActions } from '../action'
import { Util } from '../util'
import ItemScore from './ItemScore'
import CollectionEditModal from './CollectionEditModal'

import { DisplayName } from './'
import { Row, Col, Descriptions, Divider, Tag, Tooltip } from 'antd'
import './ItemInfoPage.css'
import { RootState } from '../reducer'

function ItemInfoPage({match}: any) {
    const auth = useSelector((state: RootState) => state.auth)
    const item = useSelector((state: RootState) => state.item.item)
    const collection = useSelector((state: RootState) => state.item.collection)
    
    const location = useLocation()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(itemActions.getItemInfo(match.params.id))
    }, [])

    const showModal = () => {
        dispatch(itemActions.showModal(collection))
    }

    if (!item) {
        return (
            <div></div>
        )
    }

    const drawTags = (type: number) => {
        if (!item.Tags) {
            return
        }
        let tags = item.Tags.filter(t => t.TagType == type)
        let results = []

        let index = 0
        for(let tag of tags) {
            if (index != 0) {
                results.push(
                    <span key={tag.ID}>, <Link to={`/tag/info/${tag.ID}`}>{Util.getName(tag)}</Link></span>
                )
            } else {
                results.push(
                    <span key={tag.ID}><Link to={`/tag/info/${tag.ID}`}>{Util.getName(tag)}</Link></span>
                )
            }
            ++index
        }

        return (
            results
        )
    }

    const drawBadges = (type: number, color: string) => {
        if (!item.Tags) {
            return
        }
        let tags = item.Tags.filter(t => t.TagType == type)
        let results = []

        for(let tag of tags) {
            results.push(
                <Tag key={tag.ID} color={color} className="mb-1">
                    <Link to={`/tag/info/${tag.ID}`}>{Util.getName(tag)}</Link>
                </Tag>
            )
        }

        return (
            results
        )
    }

    const drawCog = () => {
        if (!collection || !auth.loggedIn) {
            return
        }
        return (
            <Descriptions.Item>
                <ItemScore score={collection.Score} />
                <i className="fas fa-cog text-info hand ml-4" onClick={() => {showModal()}}></i>
            </Descriptions.Item>
        )
    }

    return (
        <div>
            <Row gutter={24}>
                <Col sm={{span: 6}}>
                    <img src={item.Thumbnail} className="info-img" />
                </Col>
                <Col sm={{span: 18}}>
                    <Descriptions title={<DisplayName item={item} />} column={{xs: 2, sm: 3}} className="general-info">
                        <Descriptions.Item>
                            <i className="fas fa-users"></i> {item.MinPlayers} ~ {item.MaxPlayers}인
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <i className="far fa-clock"></i> {item.MinPlayingTime} ~ {item.MaxPlayingTime}분
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <i className="fas fa-child"></i> {item.MinAge}세 이용가
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <i className="far fa-thumbs-up"></i> {item.BestNumPlayers}인 베스트
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <i className="far fa-smile"></i> {item.RecommendNumPlayers}인 추천
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <i className="far fa-thumbs-down"></i> {item.NotRecommendedNumPlayers}인 비추천
                        </Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <Descriptions column={1}>
                        <Descriptions.Item style={{paddingBottom: '6px'}}>
                            <i className="fas fa-user"></i> 디자이너: {drawTags(3)}
                        </Descriptions.Item>
                        <Descriptions.Item>
                            <i className="fas fa-palette mt-2"></i> 아티스트: {drawTags(4)}
                        </Descriptions.Item>
                        <Descriptions.Item>
                            {drawBadges(1, "magenta")}
                        </Descriptions.Item>
                        <Descriptions.Item>
                            {drawBadges(2, "geekblue")}
                        </Descriptions.Item>
                        {drawCog()}
                    </Descriptions>
                </Col>
            </Row>
            <CollectionEditModal />
        </div>
    )
}

export { ItemInfoPage }