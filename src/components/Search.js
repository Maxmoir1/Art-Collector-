import React, { useEffect, useState } from 'react';

/**
 * Don't touch these imports!
 */
import {
  fetchAllCenturies,
  fetchAllClassifications,
  fetchQueryResults
} from '../api';

const Search = (props) => {
  // Make sure to destructure setIsLoading and setSearchResults from the props
  const [setIsLoading, setSearchResults] = [props.setIsLoading, props.setSearchResults];

  /**
   * We are at the Search component, a child of app. This has a form, so we need to use useState for
   * our controlled inputs:
   * 
   * centuryList, setCenturyList (default should be an empty array, [])
   * classificationList, setClassificationList (default should be an empty array, [])
   * queryString, setQueryString (default should be an empty string, '')
   * century, setCentury (default should be the string 'any')
   * classification, setClassification (default should be the string 'any')
   */

  const [centuryList, setCenturyList] = useState([]);
  const [classificationList, setClassificationList] = useState([]);
  const [queryString, setQueryString] = useState('');
  const [century, setCentury] = useState('any');
  const [classification, setClassification] = useState('any');

  /**
   * Inside of useEffect, use Promise.all([]) with fetchAllCenturies and fetchAllClassifications
   * 
   * In the .then() callback pass the returned lists to setCenturyList and setClassificationList
   * 
   * Make sure to console.error on caught errors from the API methods.
   */

  // I actually had a hard time utilizing .then functionality, it was something I definitely had to look up and Google a decent amount... Something I definitely need to brush up on and practice more.
  useEffect(() => {
    Promise.all([fetchAllCenturies(), fetchAllClassifications()])
      .then((array) => {
        setCenturyList(array[0]);
        setClassificationList(array[1])
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => { setIsLoading(false) });

  }, []);

  /**
   * This is a form element, so we need to bind an onSubmit handler to it which:
   * 
   * calls event.preventDefault()
   * calls setIsLoading, set it to true
   * 
   * then, in a try/catch/finally block:
   * 
   * try to:
   * - get the results from fetchQueryResults({ century, classification, queryString })
   * - pass them to setSearchResults
   * 
   * catch: error to console.error
   * 
   * finally: call setIsLoading, set it to false
   */
  // An async/await function is something I'm a bit more comfortable with! Although googling somethings to add or stop the code from screaming at me was great too...
  return <form id="search" onSubmit={async (event) => {
    event.preventDefault(); //To stop it from doing the thing for obvious reasons
    setIsLoading(true); //Setting the state if I have the terminology correct.

    try {
      const queryResults = await fetchQueryResults({ century, classification, queryString })
      setSearchResults(queryResults.records)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }}>
    <fieldset>
      <label htmlFor="keywords">Query</label>
      <input
        id="keywords"
        type="text"
        placeholder="enter keywords..."
        value={queryString}
        onChange={(event) => { setQueryString(event.target.value) }} />
    </fieldset>
    <fieldset>
      <label htmlFor="select-classification">Classification <span className="classification-count">({classificationList.length})</span></label>
      <select
        name="classification"
        id="select-classification"
        value={classification} //okay, so the instructions are kind of guiding me by laying down the groundwork.
        onChange={(event) => { setClassification(event.target.value) }}>
        <option value="any">Any</option>
        {classificationList.map((element, index) => {
          return <option key={index} value={element.name}>{element.name}</option>
        })}
      </select>
    </fieldset>
    <fieldset>
      <label htmlFor="select-century">Century <span className="century-count">({centuryList.length})</span></label>
      <select
        name="century"
        id="select-century"
        value={century} // Just like the others before, we'll call it what the notes suggested, onChange will be similar to the previous lines of code as well.
        onChange={(event) => { setCentury(event.target.value) }}>
        <option value="any">Any</option>
        {centuryList.map((element, index) => {
          return <option key={index} value={element.name}>{element.name}</option>
        })}
      </select>
    </fieldset>
    <button>SEARCH</button>
  </form>
}

export default Search;