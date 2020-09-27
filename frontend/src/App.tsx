import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import axios, { AxiosResponse } from "axios";
import { useForm, SubmitHandler, UnpackNestedValue } from "react-hook-form";
import Header from "./components/Header";
import ResultField from "./components/ResultField";
import CurrencyField from "./components/CurrencyField";
import CurrencySelect from "./components/CurrencySelect";
import LabelInput from "./components/LabelInput/LabelInput";
import Button from "./components/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers";

interface IResult {
  fromCur: string;
  toCur: string;
  fromAmt: number;
  toAmt: number;
}

export interface IForm extends Omit<IResult, "fromAmt" | "toAmt"> {
  amt: number;
}

const API_LINK =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8080/api";

function App() {
  const [currencies, setCurrencies] = useState<Array<string>>([]);
  const [error, setError] = useState<string>("");
  const [fromCur, setFromCur] = useState<string>("EUR");
  const [toCur, setToCur] = useState<string>("USD");
  const [fetchError, setFetchError] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const schema = yup.object().shape<IForm>({
    toCur: yup
      .string()
      .length(3, "Must be 3 characters")
      .typeError("Must be a string")
      .test("disallowed-value", "Currency not allowed", (value) =>
        value ? currencies.includes(value) : true
      )
      .required(),
    fromCur: yup
      .string()
      .typeError("Must be a string")
      .length(3, "Must be 3 characters")
      .notOneOf([yup.ref("toCur")], "Currencies mustn't match")
      .test("disallowed-value", "Currency not allowed", (value) =>
        value ? currencies.includes(value) : true
      )
      .required(),
    amt: yup
      .number()
      .transform((cv, ov) => {
        return ov === "" ? undefined : cv;
      })
      .positive("Must be a positive number")
      .test("len", "Must be not longer than 16 characters", (val) => {
        if (val) return val.toString().length <= 16;
        return true;
      })
      .nullable(true)
      .test(
        "two-decimal-places",
        "Only two decimal places allowed",
        (value) => {
          if (
            value !== undefined &&
            value !== null &&
            value.toString().includes(".")
          ) {
            return /^\d*\.\d{1,2}$/.test(value.toString());
          }
          return true;
        }
      )
      .typeError("Must be a valid number")
      .required(""),
  });

  // wrapper
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${API_LINK}/currencies`, {
          timeout: 2000,
        });
        setCurrencies(response.data.currencies);
      } catch {
        setFetchError("Failed to fetch information. Try again later.");
      }
    })();
  }, []);

  const { handleSubmit, register, errors } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IForm> = ({
    amt,
    fromCur,
    toCur,
  }: UnpackNestedValue<IForm>) => {
    (async (): Promise<void> => {
      try {
        const response: AxiosResponse<IResult> = await axios.post(
          `${API_LINK}/exchange`,
          {
            ccy_from: fromCur,
            ccy_to: toCur,
            amt: amt,
          },
          { timeout: 10000 }
        );
        const data: IResult = response.data;
        setResult(
          `${data.fromAmt} ${data.fromCur} is ${data.toAmt} ${data.toCur}`
        );
      } catch (e) {
        if (e.message.startsWith("timeout")) {
          setError("Server is unreachable. Try again later");
        }
        if (e.status === 500) {
          setError("Failed to execute calculation. Try again later");
        } else if (e.status === 400) {
          setError("Wrong number format.");
        }
      }
    })();
  };

  if (fetchError) {
    return <div className="App">{fetchError}</div>;
  }

  return currencies.length === 0 ? (
    <div className="App">Loading</div>
  ) : (
    <div className="App">
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <span className="error">{error || errors.fromCur?.message}</span>
        <div className="textFields">
          <LabelInput labelText="From">
            <div className="input-error">
              <div className="input-select">
                <CurrencyField name="amt" register={register} />
                <CurrencySelect
                  register={register}
                  name="fromCur"
                  currencies={currencies}
                  value={fromCur}
                  onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
                    if (event.target.value === toCur) {
                      setToCur(fromCur);
                    }
                    setFromCur(event.target.value);
                  }}
                />
              </div>
              <span className="error">{errors.amt?.message}</span>
            </div>
          </LabelInput>
          <LabelInput labelText={"To"}>
            <CurrencySelect
              register={register}
              name="toCur"
              currencies={currencies}
              value={toCur}
              onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
                if (event.target.value === fromCur) {
                  setFromCur(toCur);
                }
                setToCur(event.target.value);
              }}
            />
            <p>{errors.toCur?.message}</p>
          </LabelInput>
        </div>
        <Button type="submit" text="Submit" />
      </form>
      <ResultField result={result} />
    </div>
  );
}

export default App;
