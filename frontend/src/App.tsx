import React, {FormEvent, useEffect, useState} from 'react';
import './App.css';
import {numberRegex} from './utils/regex';
import axios, {AxiosResponse} from 'axios';

interface IResult {
  fromCur: string;
  toCur: string;
  fromAmt: number;
  toAmt: number;
}

const API_LINK = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8080/api';

function App() {
  const [fromCur, setFromCur] = useState<string>("EUR");
  const [toCur, setToCur] = useState<string>("USD");
  const [amt, setAmt] = useState<string>('')
  const [currencies, setCurrencies] = useState<Array<string>>([]);
  const [error, setError] = useState<string>('');
  const [fetchError, setFetchError] = useState<string>('');
  const [result, setResult] = useState<string>('');

  // wrapper
  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const response = await axios.get(`${API_LINK}/currencies`, { timeout: 2000 });
        setCurrencies(response.data.currencies);
      } catch {
        setFetchError("Failed to fetch information. Try again later.")
      }
    };
    getCurrencies().then(() => {});
  }, []);

  const validateInputs = (): void => {
    if (!numberRegex.test(amt)) {
      setError('From value is invalid');
      return;
    } else {
      setError('');
    }
    if (!currencies.includes(fromCur)) {
      setError('1st currency value is invalid');
      return;
    } else setError('');
    if (!currencies.includes(toCur)) {
      setError('2nd currency value is invalid');
      return;
    } else setError('');
    if (fromCur === toCur) {
      setError('Currencies should not be identical');
      return;
    } else setError('');
    // Valid info

    // post
    const postAmounts = async (): Promise<void> => {
      try {
        const response: AxiosResponse<IResult> = await axios.post(`${API_LINK}/exchange`, {
          "ccy_from": fromCur,
          "ccy_to": toCur,
          "amt": amt,
        }, { timeout: 10000 });
        const data: IResult = response.data;
        setResult(`${data.fromAmt}${data.fromCur} is ${data.toAmt}${data.toCur}`);
      } catch (e) {
        if (e.message.startsWith('timeout')) {
          setError('Server is unreachable. Try again later');
        }
        if (e.status === 500) {
          setError("Failed to execute calculation. Try again later");
        } else if (e.status === 400) {
          setError("Wrong number format.")
        }
      }
    };
    postAmounts().then(() => {});
  };

  if (fetchError) {
    return <div className="App">{fetchError}</div>
  }

  return currencies.length === 0 ? <div className="App">Loading</div> : (
    <div className="App">
      <header className="App-header">
        <h1>Currency exchange</h1>
      </header>
      <div className="error">
        {error}
      </div>
      <div className="result">
        <label>Result</label>
        <input readOnly type="text" value={result}/>
      </div>
      <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        validateInputs();
      }} >
        <div className="textFields">
          <div className="label-input">
            <label>From</label>
            <div>
              <input
                required
                value={amt}
                type="text"
                maxLength={17}
                placeholder="f.e. 12.23"
                onKeyPress={(event) => {
                  if (!((event.key >= '0' && event.key <= '9') || event.key === '.')) {
                    event.preventDefault();
                  }
                }}
                onChange={(event: FormEvent<HTMLInputElement>) => setAmt(event.currentTarget.value)}
              />
              <select
                required
                value={fromCur}
                onChange={(event) => {
                  if (event.target.value === toCur) {
                    setToCur(fromCur);
                  }
                  setFromCur(event.target.value);
                }}
              >
                {currencies.length !== 0 && currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="label-input">
            <label>To</label>
            <select
              required
              value={toCur}
              onChange={(event) => {
                if (event.target.value === fromCur) {
                  setFromCur(toCur);
                }
                setToCur(event.target.value)
              }}
            >
              {currencies.length !== 0 && currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>
          <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
