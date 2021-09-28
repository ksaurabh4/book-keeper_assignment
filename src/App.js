import { useEffect, useState } from "react";
import { fetchEvents } from "./redux/actions";
import './App.css'
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment'

function App() {
  const dispatch = useDispatch()
  const [searchedValue, setSearchedValue] = useState('')
  const [searchType, setSearchType] = useState('')

  const eventInfo = useSelector(state => state.eventInfo)
  const { events } = eventInfo
  const search = (e) => {
    if (searchType === '') {
      alert('Select Search Type First!')
    }
    setSearchedValue(e.target.value)
  };

  const onClickHandler = () => {
    if (searchType !== '' & searchedValue !== '') {
      dispatch(fetchEvents(searchType, searchedValue))
    }
  }
  const onResetClickHandler = () => {
    dispatch(fetchEvents())
  }

  useEffect(() => {
    dispatch(fetchEvents())
  }, [])



  return (

    <div className="App">
      <div className="form-group pull-right">
        <label for="type">Choose Search Type:</label>
        <select name="type" id="type" onChange={e => setSearchType(e.target.value)}>
          <option value="">Select</option>
          <option value="email">Email</option>
          <option value="component">Component</option>
          <option value="environment">Environment</option>
        </select>
        <input type="text" className="search form-control" placeholder="What you looking for?" onChange={(e) => search(e)} />
        <button style={{ marginTop: 15, borderRadius: 5 }} onClick={onClickHandler}>Search</button>
        <button style={{ marginTop: 15, margingLeft: 25, borderRadius: 5 }} onClick={onResetClickHandler}>Cancle filer</button>
      </div>
      <span className="counter pull-right" />
      <table className="table table-hover table-bordered results">
        <thead>
          <tr>
            <th>#</th>
            <th className="col-md-2 col-xs-2">Created At</th>
            <th className="col-md-2 col-xs-2">Email</th>
            <th className="col-md-1 col-xs-1">Environment</th>
            <th className="col-md-1 col-xs-1">Component</th>
            <th className="col-md-2 col-xs-2">Message</th>
            <th className="col-md-5 col-xs-5">Data</th>
          </tr>
          <tr className="warning no-result">
            <td colSpan={4}><i className="fa fa-warning" /> No result</td>
          </tr>
        </thead>
        <tbody>
          {events && events.length > 0 && events.map(e => <tr>
            <th scope="row">{e.id}</th>
            <td>{moment.unix(e.createdAt).format('YYYY-MM-DD hh:mm:ss')}</td>
            <td>{e.email}</td>
            <td>{e.environment}</td>
            <td>{e.component}</td>

            <td>{e.message}</td>
            <td>{e.payload}</td>
          </tr>)}
        </tbody>
      </table>




    </div>


  );
}

export default App;
