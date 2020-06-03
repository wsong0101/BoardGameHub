import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { itemActions } from '../action'
import { DisplayName } from './'
import { RootState } from '../reducer'

function TagInfoPage({match}: any) {
    const tag = useSelector((state: RootState) => state.item.tag)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(itemActions.getTagInfo(match.params.id))
    }, [])

    if (!tag) {
        return <div></div>
    }

    return (
        <div>
            <h3><DisplayName tag={tag} /></h3>
        </div>
    )
}

export { TagInfoPage }