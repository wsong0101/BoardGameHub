import React from 'react'
import Axios from 'axios'

export default class ItemCreate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {geekId: ''}

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({geekId: e.target.value})
    }

    handleSubmit(e) {
        e.preventDefault()
        let form = new FormData()
        form.append('geekId', this.state.geekId)

        Axios.post('/item/geekinfo', form)
            .then( res => {
                console.log(res)
            })
    }

    render() {
        return (
            <div className="content py-4 px-3">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="idIput">ID</label>
                        <input type="text" name="geekId" className="form-control"
                            id="idIput" onChange={this.handleChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}