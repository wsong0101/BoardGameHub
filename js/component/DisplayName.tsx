import React from 'react'
import { useDispatch } from 'react-redux'

import { history } from '../helper'
import { Util } from '../util'
import { itemProposeKorean } from '../reducer'

import { Tooltip } from 'antd'
import { IItem, ITag } from '../common'

type DisplayProps = {
    item?: IItem
    tag?: ITag
}

function DisplayName({item, tag}: DisplayProps) {
    const dispatch = useDispatch()

    const proposeName = (target: any, type: string) => {
        dispatch(itemProposeKorean(type, target.ID, target.PrimaryName, location.pathname))
        history.push("/propose")
    }

    const displayEdit = (target: any, type: string) => {
        if (target.KoreanName == "") {
            return (
                <Tooltip title="한글 이름 제안">
                    <span><i className="fas fa-edit ml-2 hand" onClick={() => {proposeName(target, type)}}></i></span>
                </Tooltip>
            )
        }
    }

    let target = item ? item : tag
    let type = item ? "name" : "tag"

    return (
        <span>
            {Util.getName(target)}
            {displayEdit(target, type)}
        </span>
    )
}

export { DisplayName }