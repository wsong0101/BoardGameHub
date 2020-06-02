import React from 'react'
import { useDispatch } from 'react-redux'

import { history } from '../helper'
import { Util } from '../util'
import { itemProposeKorean } from '../reducer'

import { Tooltip } from 'antd'

function DisplayName(props) {
    const dispatch = useDispatch()

    const proposeName = (item, type) => {
        dispatch(itemProposeKorean(type, item.ID, item.PrimaryName, location.pathname))
        history.push("/propose")
    }

    const displayEdit = (item, type) => {
        if (item.KoreanName == "") {
            return (
                <Tooltip title="한글 이름 제안">
                    <span><i className="fas fa-edit ml-2 hand" onClick={() => {proposeName(item, type)}}></i></span>
                </Tooltip>
            )
        }
    }

    let target = props.item ? props.item : props.tag
    let type = props.item ? "name" : "tag"

    return (
        <span>
            {Util.getName(target)}
            {displayEdit(target, type)}
        </span>
    )
}

export { DisplayName }