import axios from 'axios';
import parser from 'fast-xml-parser';

const LB_url = 'https://www.lb.lt/webservices/FxRates/FxRates.asmx';

export const fetchCurrencyRates = async (tp: 'LT' | 'EU' = 'LT'): Promise<any> => {
  try {
    const response = await axios.get(`${LB_url}/getCurrentFxRates?tp=${tp}`);
    return parser.parse(response.data);
  } catch (e) {
    console.log(e);
  }
}

export const fetchCurrencyList = async (): Promise<any> => {
  try {
    const response = await axios.get(`${LB_url}/getCurrencyList`)
    return parser.parse(response.data);
  } catch (e) {
    console.log(e);
  }
}
